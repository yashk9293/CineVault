package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"movie-app/config"
	"movie-app/models"
	"movie-app/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getCollection() string {
	return os.Getenv("DB_NAME")
}

// ✅ CREATE MOVIE
func CreateMovie(w http.ResponseWriter, r *http.Request) {
	var movie models.Movie
	userID := r.Context().Value("userId").(string)

	err := json.NewDecoder(r.Body).Decode(&movie)
	if err != nil {
		utils.SendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	movie.ID = primitive.NewObjectID()
	movie.UserId = userID 
	movie.CreatedAt = primitive.NewDateTimeFromTime(time.Now())

	collection := config.DB.Database(getCollection()).Collection("movies")

	_, err = collection.InsertOne(context.Background(), movie)
	if err != nil {
		utils.SendError(w, err.Error(), 500)
		return
	}

	utils.SendSuccess(w, movie, "Movie created")
}

// ✅ GET MOVIES (MULTI-FIELD SEARCH + FILTER + PAGINATION + SORT)
func GetMovies(w http.ResponseWriter, r *http.Request) {
	collection := config.DB.Database(getCollection()).Collection("movies")
	userID := r.Context().Value("userId").(string)

	query := r.URL.Query()
	
	// Start with the ownership filter
	filter := bson.M{"userId": userID} 

	// 🔍 GLOBAL SEARCH (Title, Description, Genre, Tags)
	if search := query.Get("search"); search != "" {
		searchQuery := bson.M{
			"$regex":   search,
			"$options": "i", // Case-insensitive
		}

		// Use $or to search across multiple fields
		filter["$or"] = []bson.M{
			{"title": searchQuery},
			{"description": searchQuery},
			{"genre": searchQuery}, // MongoDB searches inside arrays automatically
			{"tags": searchQuery},
		}
	}
	
	// 🎯 SPECIFIC FILTERS (Optional: if you want to narrow down results further)
	if genre := query.Get("genre"); genre != "" {
		filter["genre"] = bson.M{"$in": []string{genre}}
	}
	if tag := query.Get("tag"); tag != "" {
		filter["tags"] = bson.M{"$in": []string{tag}}
	}
	if watched := query.Get("watched"); watched != "" {
		filter["watched"] = watched == "true"
	}

	// 📄 PAGINATION
	page, _ := strconv.Atoi(query.Get("page"))
	limit, _ := strconv.Atoi(query.Get("limit"))
	if page <= 0 { page = 1 }
	if limit <= 0 { limit = 10 }
	skip := (page - 1) * limit

	opts := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))

	// 📊 SORTING
	sort := query.Get("sort")
	if sort == "rating_desc" {
		opts.SetSort(bson.D{{"rating", -1}})
	} else if sort == "rating_asc" {
		opts.SetSort(bson.D{{"rating", 1}})
	} else {
		opts.SetSort(bson.D{{"createdAt", -1}}) // Default: Newest first
	}

	cursor, err := collection.Find(context.Background(), filter, opts)
	if err != nil {
		utils.SendError(w, err.Error(), 500)
		return
	}
	defer cursor.Close(context.Background())

	movies := []models.Movie{} 
	cursor.All(context.Background(), &movies)

	total, _ := collection.CountDocuments(context.Background(), filter)

	response := map[string]interface{}{
		"data":  movies,
		"page":  page,
		"limit": limit,
		"total": total,
	}

	utils.SendSuccess(w, response, "Movies fetched")
}

// ✅ GET MOVIE BY ID
func GetMovieByID(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	userID := r.Context().Value("userId").(string)

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		utils.SendError(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	var movie models.Movie
	collection := config.DB.Database(getCollection()).Collection("movies")

	err = collection.FindOne(context.Background(), bson.M{"_id": objID, "userId": userID}).Decode(&movie)
	if err != nil {
		utils.SendError(w, "Movie not found", 404)
		return
	}

	utils.SendSuccess(w, movie, "Movie fetched successfully")
}

// ✅ UPDATE MOVIE
func UpdateMovie(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	userID := r.Context().Value("userId").(string)

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		utils.SendError(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	var movie models.Movie
	if err := json.NewDecoder(r.Body).Decode(&movie); err != nil {
		utils.SendError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	update := bson.M{
		"$set": bson.M{
			"title":       movie.Title,
			"description": movie.Description,
			"genre":       movie.Genre,
			"rating":      movie.Rating,
			"watched":     movie.Watched,
			"tags":        movie.Tags,
		},
	}

	collection := config.DB.Database(getCollection()).Collection("movies")

	result, err := collection.UpdateOne(context.Background(), bson.M{"_id": objID, "userId": userID}, update)
	if err != nil || result.MatchedCount == 0 {
		utils.SendError(w, "Update failed: Unauthorized or not found", 403)
		return
	}

	utils.SendSuccess(w, nil, "Movie updated successfully")
}

// ✅ DELETE MOVIE
func DeleteMovie(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	userID := r.Context().Value("userId").(string)

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		utils.SendError(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	collection := config.DB.Database(getCollection()).Collection("movies")

	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objID, "userId": userID})
	if err != nil || result.DeletedCount == 0 {
		utils.SendError(w, "Delete failed: Unauthorized or not found", 403)
		return
	}

	utils.SendSuccess(w, nil, "Movie deleted successfully")
}