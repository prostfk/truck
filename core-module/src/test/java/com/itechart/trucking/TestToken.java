package com.itechart.trucking;

import com.itechart.trucking.token.entity.Token;
import com.itechart.trucking.token.repository.TokenRepository;
import com.itechart.trucking.token.service.TokenService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.when;

public class TestToken {

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private TokenService tokenService;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testRemove() {
        try {
            tokenService.remove(new Token());
        } catch (Exception e) {
            Assert.fail();
        }
    }

    @Test
    public void testFindTokenByTokenValue() {
        when(tokenService.findTokenByTokenValue("asfe4s65gdg4d5sd5fg"))
                .thenReturn(new Token());
    }

    @Test
    public void testSave() {
        when(tokenService.save(new Token()))
                .thenReturn(new Token());
    }

    @Test
    public void testFindTokenByEmail() {
        when(tokenService.findTokenByEmail("prostrmk@gmail.com"))
                .thenReturn(new Token());

    }
}
