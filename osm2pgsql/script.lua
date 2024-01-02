local tables = {}

tables.restaurants = osm2pgsql.define_node_table('restaurants', {{
    column = 'name',
    type = 'text'
}, {
    column = 'cuisine',
    type = 'text'
}, {
    column = 'geom',
    type = 'point',
    not_null = true,
    projection = 4326
}})

tables.roads = osm2pgsql.define_way_table('roads', {{
    column = 'name',
    type = 'text'
}, {
    column = 'ref',
    type = 'int'
}, {
    column = 'surface',
    type = 'text'
}, {
    column = 'geom',
    type = 'linestring',
    not_null = true,
    projection = 4326
}})

tables.hospital = osm2pgsql.define_area_table('hospitals', {{
    column = 'name',
    type = 'text'
}, {
    column = 'geom',
    type = 'geometry',
    not_null = true,
    projection = 4326
}})

function osm2pgsql.process_node(object)
    if object.tags.amenity == 'restaurant' then
        tables.restaurants:add_row({
            name = object.tags.name,
            cuisine = object.tags.cuisine,
        })
    end
end

function osm2pgsql.process_way(object)

    if object.tags.building == 'hospital' then
        tables.hospital:add_row({
            name = object.tags.name,
            geom = { create = 'area' }
        })
      elseif object.tags.highway then
        tables.roads:add_row({
            name = object.tags.name,
            ref = object.tags.ref,
            surface = object.tags.surface,
        })
    end
end

function osm2pgsql.process_relation(object)
    -- Store multipolygons and boundaries as polygons
    if object.tags.building == 'hospital' then
        tables.hospital:add_row({
            name = object.tags.name,
            geom = { create = 'area' }
        })
    end
end
