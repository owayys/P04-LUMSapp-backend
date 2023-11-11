-> `npm run dev` <-

# DB Setup

```
mysql -u username -p -h localhost LUMSapp < currSchema.sql
```

OR

```
> mysql -u root -p

mysql> create database LUMSapp;
mysql> use LUMSapp;
mysql> source currSchema.sql;
```

# Endpoints

## Auth

-   ### '/api/user/signup'
    e.g.,
    ```
    {
        "name": "Name",
        "email": "24100290@lums.edu.pk",
        "password": "yo124",
        "type": "STUDENT" OR "COUNCIL" OR "SOCIETY" OR "ADMIN"
    }
    ```
    -   returns code 200 on success,
    -   else error
-   ### '/api/user/login'
    e.g.,
    ```
    {
        "email": "24100290@lums.edu.pk",
        "password": "yo124"
    }
    ```
    -   returns code 200 on success,
    -   returns code 401 on incorrect details,
    -   else error
