package routes

import (
	"movie-app/controllers"
	"movie-app/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func DashboardRoutes(r *mux.Router) {
	// These should also be protected so only logged-in users see stats
	r.Handle("/dashboard/watch-stats", middleware.AuthMiddleware(http.HandlerFunc(controllers.GetWatchStats))).Methods("GET")
	r.Handle("/dashboard/genre-stats", middleware.AuthMiddleware(http.HandlerFunc(controllers.GetGenreStats))).Methods("GET")
}