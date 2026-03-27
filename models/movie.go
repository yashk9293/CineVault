// models/movie.go

package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Movie struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserId      string             `bson:"userId" json:"userId"`
    Title       string             `bson:"title" json:"title"`
    Description string             `bson:"description" json:"description"`
    Genre       []string           `bson:"genre" json:"genre"`
    Rating      float64            `bson:"rating" json:"rating"`
    ReleaseYear int                `bson:"releaseYear" json:"releaseYear"`
    Watched     bool               `bson:"watched" json:"watched"`
    Tags        []string           `bson:"tags" json:"tags"`
    CreatedAt   primitive.DateTime `bson:"createdAt" json:"createdAt"`
}