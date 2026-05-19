package org.example.springbootapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve /uploads/** URLs from the filesystem "uploads" folder
//        registry.addResourceHandler("/"+uploadDir+"/**")
//                .addResourceLocations("file:"+uploadDir+"/");





        registry.addResourceHandler("/small/**")
                .addResourceLocations("file:uploads/small/");

        registry.addResourceHandler("/medium/**")
                .addResourceLocations("file:uploads/medium/");

        registry.addResourceHandler("/original/**")
                .addResourceLocations("file:uploads/original/");
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/images/");


    }
}
