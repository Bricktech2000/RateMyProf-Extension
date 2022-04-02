import json

constant_time_name_lookup = {}

with open('data.json', 'r') as f:
    print('loading data...')
    data = json.loads(f.read()[5:-1]) # index to remove "noCB()"
    print('number of profs in database: ', data['response']['numFound']) # 1927062 profs in total
    # print(data['response']['docs'][0]) # first prof
    print('creating constant lookup dictionary by name...')
    for prof in data['response']['docs']:
      if 'teacherfirstname_t' in prof and 'teacherlastname_t' in prof:
        # 'n': prof['total_number_of_ratings_i'],
        constant_time_name_lookup[prof['teacherfirstname_t'] + ' ' + prof['teacherlastname_t']] = {'s': prof.get('averageratingscore_rf', 0), 'id': prof['pk_id']}
    # print(constant_name_lookup)
    
    print('saving to file...')

    with open('processed.json', 'w') as f:
        f.write(json.dumps(constant_time_name_lookup))

    print('done.')
