import json

constant_time_name_lookup = {}

with open('data.json', 'r') as f:
    data = json.loads(f.read()[5:-1]) # index to remove "noCB()"
    print('number of profs in database: ', data['response']['numFound']) # 1927062 profs in total
    # print(data['response']['docs'][0]) # first prof
    print('creating constant lookup dictionary by name...')
    for prof in data['response']['docs']:
      constant_time_name_lookup[prof.get('teacherfirstname_t', '') + ' ' + prof.get('teacherlastname_t', '')] = {'s': prof.get('averageratingscore_rf', 0), 'n': prof['total_number_of_ratings_i']}
    # print(constant_name_lookup)
    
    print('saving to file...')

    with open('processed.json', 'w') as f:
        f.write(json.dumps(constant_time_name_lookup))

    print('done.')
