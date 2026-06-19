package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SpringCommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringCommerceApplication.class, args);
	}

}
