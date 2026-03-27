package controllers

import (
    "context"
    "net/http"
    "time"

    "movie-app/config"
    "movie-app/utils"

    "go.mongodb.org/mongo-driver/bson"
)

func GetWatchStats(w http.ResponseWriter, r *http.Request) {
    collection := config.DB.Database(getCollection()).Collection("movies")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    pipeline := []bson.M{
        {
            "$group": bson.M{
                "_id":   "$watched",
                "count": bson.M{"$sum": 1},
            },
        },
    }

    cursor, err := collection.Aggregate(ctx, pipeline)
    if err != nil {
        utils.SendError(w, err.Error(), 500)
        return
    }
    defer cursor.Close(ctx)

    var result []bson.M
    err = cursor.All(ctx, &result)
    if err != nil {
        utils.SendError(w, err.Error(), 500)
        return
    }

    utils.SendSuccess(w, result, "Watch stats fetched")
}



func GetGenreStats(w http.ResponseWriter, r *http.Request) {
    collection := config.DB.Database(getCollection()).Collection("movies")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    pipeline := []bson.M{
        {"$unwind": "$genre"},
        {
            "$group": bson.M{
                "_id":   "$genre",
                "count": bson.M{"$sum": 1},
            },
        },
    }

    cursor, err := collection.Aggregate(ctx, pipeline)
    if err != nil {
        utils.SendError(w, err.Error(), 500)
        return
    }
    defer cursor.Close(ctx)

    var result []bson.M
    err = cursor.All(ctx, &result)
    if err != nil {
        utils.SendError(w, err.Error(), 500)
        return
    }

    utils.SendSuccess(w, result, "Genre stats fetched")
}