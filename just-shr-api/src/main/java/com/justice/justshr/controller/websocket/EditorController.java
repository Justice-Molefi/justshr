package com.justice.justshr.controller.websocket;


import com.justice.justshr.dto.WsEditorDto;
import com.justice.justshr.model.Session;
import com.justice.justshr.service.SessionService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class EditorController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final SessionService sessionService;

    public EditorController(SimpMessagingTemplate simpMessagingTemplate, SessionService sessionService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.sessionService = sessionService;
    }

    @MessageMapping("/editor-content")
    public void content(WsEditorDto wsEditorDto){
        Session session = sessionService.updateSessionContent(wsEditorDto.getSessionId(), wsEditorDto.getContent());
        String destination = "/topic/editor-content/" + wsEditorDto.getSessionId();
        String content = session.getContent();
        simpMessagingTemplate.convertAndSend(destination, content);
    }
}
