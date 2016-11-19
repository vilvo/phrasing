# this is a helper script that parses the text file
# listing the airquality measuring stations into JSON format which the phrasing service can use
# the text file is a part of the airquality-finland GitHub project and is available here
# https://github.com/mikkohei13/airquality-finland/blob/master/get_parameters.md
# the original file was modified by removing everything else except the station information

import json


def isFloat( string ):
    """
    method checks if a given string is a float
    """
    try:
        float( string )
        return True
        
    except ValueError:
        return False

stationsFile = open( 'stations.md', 'r' )
# save the stations here. city name is the key
stations = {}

for line in stationsFile.readlines():
    line = unicode( line, 'UTF-8'  )
    line = line.strip() # remove end of line character if present
    line = line.split( ':' )
    # before : line contains - character station id and city name separated by 1 or more spaces
    part1 = line[0].split()
    
    station = {} # station info goes here
    station['id'] = int( part1[1] )
    station['city'] = part1[2].encode( 'UTF-8' )
    
    # after : line contains station location name / addres and possibly GPS coordinates
    part2 = line[1].split()
    # do we have coordinates i.e.  two numbers at the end of the line
    if len( part2 ) > 2 and isFloat( part2[-1] ) and isFloat( part2[-2] ):
        station['latitude'] = float( part2[-2] )
        station['longitude'] = float( part2[-1] )
        # remove the coordinates 
        part2 = part2[:-2]
        
    # location name is the rest of the line after :
    # if there are no coordinates. or the rest of the line after :
    # with coordinates removed
    # create a string from the list
    station['location'] = ' '.join( part2 ).encode( 'UTF-8' )
    
    # add station to stations
    if not station['city'] in stations:
        stations[station['city']] = [ station ]
        
    else:
        stations[ station['city']].append( station )
        
# save to json file            
json.dump( stations, open( 'stations.json', 'wb' ), ensure_ascii = False, indent = 3 )