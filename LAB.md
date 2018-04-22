Ripe Banana
===

## Description

For this assignment, you'll be creating a database of movie films (with reviews), movie studios, actors, reviews and reviewers.

**Work in groups of 2-3 on this lab**

### Models

* Studio
* Film
* Actor
* Reviewer
* Review

#### Directions Key
* `<...>` is a placeholder for actual data.
* `S` = string, `D` = date, `N` = number, `I` = ObjectId
* Properties marked with `R` are required.

#### Studio

```
{
  name: <name-of-studio RS>,
  address: {
    city: <city S>
    state: <state S>
    country: <country S>
  }
}
```

#### Film

```
{
  title: <title of film RS>,
  studio: <studio _id RI>,
  released: <4-digit year RN>,
  cast: [{
    part: <name of character S>,
    actor: <actor _id RI>
  }]
}
```

#### Actor

```
{ 
  name: <name RS>,
  dob: <date-of-birth D>,
  pob: <place-of-birth S>
}
```

#### Reviewer

```
{ 
  name: <string RS>,
  company: <company or website name RS>
}
```


#### Review

```
{ 
  rating: <rating number 1-5 RN>,
  reviewer: <review _id RI>
  review: <review-text, max-length 140 chars RS>,
  film: <film-id RI>,
  createdAt: <created timestamp RD>,
  updatedAt: <updated timestamp RD>
}
```


### Routes

#### GET

While the schemas should look like the data definitions above, these are descriptions of the data that should be returned from the various `GET` methods. You will need to use `lean`, `populate`, `select` and combining data to shape the appropriate response. 

##### `GET /studios`
```
[{ _id, name }]
```

##### `GET /studios/:id`

```
{ _id, name, address, films: [{ _id, title }] }
```

##### `GET /films`

```
[{ 
    _id, title, released, 
    studio: { _id, name } 
}]
```

##### `GET /films/:id`

```
{   
    title, released, 
    studio: { _id, name }, 
    cast: [{ 
        _id, role, 
        actor: { _id, name }
    }], 
    reviews: [{ 
        id, rating, review, 
        reviewer: { _id, name }
    ]
}
```

##### `GET /actors`

```
[{ _id, name }]
```

##### `GET /actors/:id`

```
{ 
    name, dob, pob,     
    films: [{ id, title, released }] 
}
```

##### `GET /reviewer`

```
[{ _id, name, company }]
```

##### `GET /reviewer/:id`

```
{ 
    _id, name, company, 
    reviews: [{ 
        _id, rating, review, 
        film: { _id, name }
    }] 
}
```

##### `GET /reviews`

**limit to 100 most recent**

```
[{ 
    _id, rating, review, 
    film: { _id, name }
}] 
```



#### POST/PUT

Studio, Films, and Actors, Reviewers and Reviews can be added.

Actors and Reviewers updated.

#### DELETE

Studio, Films, and Actors can be deleted. **However**, studios cannot be deleted if there are films and actors cannot be deleted who are in films.

## Testing

* Unit tests for models
* E2E API tests

## Rubric:

* Models: 5pts
* Relationships: 5pts
* Routes: 5pts
* Project Organization and Testing: 5pts
