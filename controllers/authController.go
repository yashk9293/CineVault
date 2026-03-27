package controllers

import (
    "context"
    "encoding/json"
    "net/http"
    "os"
    "time"

    "movie-app/config"
    "movie-app/models"
    "movie-app/utils"

    "golang.org/x/crypto/bcrypt"
    "github.com/golang-jwt/jwt/v5"
    "go.mongodb.org/mongo-driver/bson"
)


func Signup(w http.ResponseWriter, r *http.Request) {
    var user models.User

    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        utils.SendError(w, "Invalid request", 400)
        return
    }

    collection := config.DB.Database(config.GetDBName()).Collection("users")

    // check if email exists
    var existing models.User
    err = collection.FindOne(context.Background(), bson.M{"email": user.Email}).Decode(&existing)
    if err == nil {
        utils.SendError(w, "User already exists", 400)
        return
    }

    // hash password
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
    user.Password = string(hashedPassword)

    _, err = collection.InsertOne(context.Background(), user)
    if err != nil {
        utils.SendError(w, err.Error(), 500)
        return
    }

    utils.SendSuccess(w, nil, "User registered successfully")
}



func Login(w http.ResponseWriter, r *http.Request) {
    var user models.User

    json.NewDecoder(r.Body).Decode(&user)

    collection := config.DB.Database(config.GetDBName()).Collection("users")

    var dbUser models.User
    err := collection.FindOne(context.Background(), bson.M{"email": user.Email}).Decode(&dbUser)
    if err != nil {
        utils.SendError(w, "Invalid credentials", 401)
        return
    }

    // compare password
    err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password))
    if err != nil {
        utils.SendError(w, "Invalid credentials", 401)
        return
    }

    // generate JWT
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userId": dbUser.ID.Hex(),
        "exp":    time.Now().Add(time.Hour * 24).Unix(),
    })

    tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

    utils.SendSuccess(w, map[string]string{
        "token": tokenString,
    }, "Login successful")
}
