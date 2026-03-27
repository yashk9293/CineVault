package routes

import (
    "movie-app/controllers"

    "github.com/gorilla/mux"
)

func AuthRoutes(r *mux.Router) {
    r.HandleFunc("/auth/signup", controllers.Signup).Methods("POST")
    r.HandleFunc("/auth/login", controllers.Login).Methods("POST")
}