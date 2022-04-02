# RateMyProf Extension

A Chromium extension to automatically underline professor names with their RateMyProfessor ratings

## Requirements

- Any Chromium-based browser
- Python 3.6+

## Installation

### Downloading RateMyProfessor Data

Run the following to download the RateMyProfessor data for the University of Ottawa (school ID `1452`):

```bash
curl -o data.json "https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows=10000000&wt=json&json.wrf=noCB&callback=noCB&q=*%3A*+AND+schoolid_s%3A1452&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s&fq="
python3 preprocess.py
```

### Installing the Extension

1. Clone the repository
2. Navigate to _chrome://extensions_
3. Click the "Load unpacked extension..." button
4. Select the downloaded folder
5. Click the "Load" button
