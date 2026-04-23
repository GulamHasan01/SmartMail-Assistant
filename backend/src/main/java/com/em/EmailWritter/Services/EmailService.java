package com.em.EmailWritter.Services;

import com.em.EmailWritter.Controller.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailService {

    private final WebClient webClient;

    @Value("${grok.api.url}")
    private String grokApiUrl;

    @Value("${grok.api.key}")
    private String grokApiKey;

    public EmailService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String generateReply(EmailRequest emailRequest) {

        if (grokApiKey == null || grokApiKey.isEmpty()) {
            return "API key not configured";
        }

        String prompt = buildPrompt(emailRequest);

        try {
            String response = webClient.post()
                    .uri("https://api.groq.com/openai/v1/chat/completions")
                    .header("Authorization", "Bearer " + grokApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(Map.of(
                            "model", "llama-3.1-8b-instant",
                            "messages", new Object[]{
                                    Map.of("role", "user", "content", prompt)
                            }
                    ))
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .map(errorBody -> new RuntimeException("Groq API Error: " + errorBody))
                    )
                    .bodyToMono(String.class)
                    .block();

            return extractResponse(response);

        } catch (Exception e) {
            return "Error calling AI service: " + e.getMessage();
        }
    }

    private String extractResponse(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode choices = root.path("choices");

            if (choices.isMissingNode() || choices.size() == 0) {
                return "No response from AI";
            }

            return choices.get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            return "Error parsing AI response: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Do not include subject line. ");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use ").append(emailRequest.getTone()).append(" tone. ");
        }

        prompt.append("\nEmail:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}