//package com.dev.music_manager_backend.configures;
//
//import com.fasterxml.jackson.annotation.JsonInclude;
//import com.fasterxml.jackson.databind.SerializationFeature;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import org.hibernate.proxy.HibernateProxy;
//import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class JacksonConfig {
//    @Bean
//    public Jackson2ObjectMapperBuilderCustomizer addCustomBigDecimalDeserialization() {
//        return builder -> {
//            builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//            builder.serializationInclusion(JsonInclude.Include.NON_NULL);
//            builder.modules(new JavaTimeModule());
//            builder.mixIn(HibernateProxy.class, SongMixin.class);
//            builder.mixIn(HibernateProxy.class, UserMixin.class);
//        };
//    }
//
//}
//
