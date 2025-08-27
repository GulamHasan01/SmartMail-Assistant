package com.em.EmailWritter.Controller;

import com.em.EmailWritter.Services.emailServices;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {


    private final emailServices emailServices;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
      String response = emailServices.generateReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
