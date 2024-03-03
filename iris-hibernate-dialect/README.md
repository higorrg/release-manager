# IRIS Hibernate Dialect Library

## Build

```bash
mvn clean package
```

## Install

```bash
mvn install:install-file -Dfile=target/iris-hibernate-dialect-1.0-SNAPSHOT.jar -DgroupId=org.hibernate -DartifactId=iris-hibernate-dialect -Dversion=1.0.0 -Dpackaging=jar
```

## Add To Your Project

```xml
<dependency>
  <groupId>org.hibernate</groupId>
  <artifactId>iris-hibernate-dialect</artifactId>
  <version>1.0.0</version>
</dependency>
```