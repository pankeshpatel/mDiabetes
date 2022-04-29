### Steps to run the app

#### Using virtual env

1. Create a virtual environment and activate the virtual environment

```
virtualenv env
source env/bin/activate
```

2. Install the dependencies

```
pip install -r requirements.txt
```

3. Start the app

```
python app.py
```

#### Using docker

1. Build a container image using docker build

```
docker build --tag food-detection-app .
```

2. Start the container

```
docker run --name food-detection-app -p 8080:8080 food-detection-app
```

The `Swagger UI` can be accessed at `http://localhost:8080`
