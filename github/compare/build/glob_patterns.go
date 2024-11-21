package main

import (
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/bmatcuk/doublestar/v4"
)

func main() {
	// Check for correct number of arguments
	if len(os.Args) < 2 {
		log.Fatalf("Usage: %s '<patterns>'", os.Args[0])
	}

	// Split patterns by newline and store in a slice
	patterns := strings.Split(os.Args[1], "\n")

	// Read files from stdin
	contents, err := io.ReadAll(os.Stdin)
	if err != nil {
		log.Fatalf("Error reading files from stdin: %v", err)
	}

	files := strings.Split(string(contents), "\n")

	// Process each file through the patterns
	for _, file := range files {
		match := false // Tracks if the file should be included

		for _, pattern := range patterns {
			if pattern == "" {
				continue
			}

			// Handle negation patterns
			negate := false
			if strings.HasPrefix(pattern, "!") {
				negate = true
				pattern = pattern[1:] // Remove '!' prefix for matching
			}

			// Check if the file matches the current pattern
			isMatch, err := doublestar.Match(pattern, file)
			if err != nil {
				log.Fatalf("Error matching pattern %q with file %q: %v", pattern, file, err)
			}

			// Update match status based on whether the pattern is negating or not
			if isMatch {
				if negate {
					match = false // Exclude the file
				} else {
					match = true // Include the file
				}
			}
		}

		// Print the file if it ended up matching
		if match {
			fmt.Println(file)
		}
	}
}
