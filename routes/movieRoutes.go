package routes

import (
    "net/http"
    "movie-app/controllers"
    "movie-app/middleware"

    "github.com/gorilla/mux"
)

func MovieRoutes(r *mux.Router) {

    // 🔐 Protected Routes
    r.Handle("/movies", middleware.AuthMiddleware(http.HandlerFunc(controllers.GetMovies))).Methods("GET")

    r.Handle("/movies", middleware.AuthMiddleware(http.HandlerFunc(controllers.CreateMovie))).Methods("POST")

    r.Handle("/movies/{id}", middleware.AuthMiddleware(http.HandlerFunc(controllers.GetMovieByID))).Methods("GET")

    r.Handle("/movies/{id}", middleware.AuthMiddleware(http.HandlerFunc(controllers.UpdateMovie))).Methods("PUT")

    r.Handle("/movies/{id}", middleware.AuthMiddleware(http.HandlerFunc(controllers.DeleteMovie))).Methods("DELETE")
}