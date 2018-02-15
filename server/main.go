package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/rwcarlsen/goexif/exif"
)

type Photo struct {
	ID      string   `json:"id,omitempty"`
	Name    string   `json:"name,omitempty"`
	Year    int      `json:"year,omitempty"`
	Month   int      `json:"month,omitempty"`
	Tags    []string `json:"tags,omitempty"`
	Persons []Person `json:"persons,omitempty"`
}

type Person struct {
	FirstName string `json:"firstname,omitempty"`
	LastName  string `json:"lastname,omitempty"`
}

var photos []Photo

// our main function
func main() {
	ScanPhotos("")

	router := mux.NewRouter()

	router.HandleFunc("/photos", GetPhotos).Methods("GET")
	router.HandleFunc("/photos/{id}/{name}", GetPhoto).Methods("GET")
	//router.HandleFunc("/photos/{id}", CreatePerson).Methods("POST")
	//router.HandleFunc("/photos/{id}", DeletePerson).Methods("DELETE")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func GetPhotos(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(photos)
}

func GetPhoto(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	for _, p := range params {
		log.Println(p)
	}
	for _, item := range photos {
		if item.ID == params["id"] {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode(&Person{})
}

func ScanPhotos(path string) {
	fmt.Println("Start scan")
	root := "C:\\Users\\RFA3456\\Google Drive\\BU Techno\\Animation\\Soirée d'agence"
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if filepath.Ext(path) == ".jpg" {
			var photo Photo
			year, month := ReadExif(path)
			photo.Year = year
			photo.Month = month
			photo.Name = path
			photos = append(photos, photo)
		}
		return nil
	})
	if err != nil {
		panic(err)
	}
	/*
		for _, photo := range photos {
			fmt.Println(photo)
		}
	*/
	fmt.Println("Finished")
}

//func CreatePerson(w http.ResponseWriter, r *http.Request) {}
//func DeletePerson(w http.ResponseWriter, r *http.Request) {}
func ReadExif(path string) (int, int) {
	fmt.Println(path)
	f, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	year := 0
	month := 0
	// Optionally register camera makenote data parsing - currently Nikon and
	// Canon are supported.
	//exif.RegisterParsers(mknote.All...)
	x, err := exif.Decode(f)
	if err != nil {
		fmt.Println("Oups")
		//log.Fatal(err)
	} else {
		// Two convenience functions exist for date/time taken and GPS coords:
		tm, _ := x.DateTime()
		fmt.Println("Taken: ", tm.Year())
		year = tm.Year()
		month = int(tm.Month())
	}

	return year, month
	/*
			camModel, _ := x.Get(exif.Model) // normally, don't ignore errors!
			fmt.Println(camModel.StringVal())

			focal, _ := x.Get(exif.FocalLength)
			numer, denom, _ := focal.Rat2(0) // retrieve first (only) rat. value
			fmt.Printf("%v/%v", numer, denom)


			lat, long, _ := x.LatLong()
		    fmt.Println("lat, long: ", lat, ", ", long)
	*/
}
