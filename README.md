# mDiabetes App

1. Running React Native Frontend

```
npm install
npx react-native run-ios
npx react-native run-android
```

2. Running backend

```
docker-compose up
docker ps
docker exec -it <CONTAINER ID> mongo -u root -p 123456
docker exec -it <CONTAINER ID> mongosh -u root -p 123456 // to access the mongoshell


```

3. Create a admin user

```
POST
http://localhost:8008/user-create
{ "username" : "admin", "password": "admin"}
```

4. Mongodb command operations

```
show databases;
use md-server-db;
show collections;
```

5. MongoDB Database access

```
This collecton would list ALL food log records, including the old records about the patient, that has been deleted by admin.
db.foodlogs.find().pretty();
```

```
This collection would list ONLY currently active patients for study.
db.patients.find().pretty();
```

```
This collection list admin login information.
db.users.find().pretty();

```

6. export data from mongodb

```
sudo docker exec -i <mongodb-containerid> mongoexport --username root --password 123456 --authenticationDatabase=admin --db md-server-db --collection foodlogs > foodlogs.csv

```

```
sudo docker exec -i 994c6241ae5a mongoexport --username root --password 123456 --authenticationDatabase=admin
 --db md-server-db --collection foodlogs --fields "patientID","mealType"  > foodlogs.txt
```

```
 sudo docker exec -i 994c6241ae5a mongoexport --username root --password 123456 --authenticationDatabase=admin
 --db md-server-db --collection foodlogs --type=csv --fields "patientID","mealType","carbs","timestamp"  > foodlogs.csv
```

# Volume estimation

### (Credit [revathyramanan](https://github.com/revathyramanan) and [Ishan Rai](https://github.com/ishanrai05))

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

```

```
