package com.example.springprivatechats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication

public class SpringPrivateChatsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringPrivateChatsApplication.class, args);
    }

}
