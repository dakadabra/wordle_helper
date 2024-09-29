#!/bin/bash

# Check if the input file exists
if [[ ! -f "unigram_freq.csv" ]]; then
    echo "File not found: in.csv"
    exit 1
fi

# Create an output file
output_file="filtered_words.json"
exec > "$output_file"

echo "{"
# Read the file line by line
while IFS=, read -r word number; do
    # Check if the word has 5 letters
    if [[ ${#word} -eq 5 ]]; then
        echo "\"$word\": $number,"
    fi
done < "unigram_freq.csv"

echo "}"