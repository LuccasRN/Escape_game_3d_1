package com.escapegame.chl_backend.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escapegame.chl_backend.dto.request.PuzzleSubmissionDTO;
import com.escapegame.chl_backend.model.Enigma;
import com.escapegame.chl_backend.model.GameSession;
import com.escapegame.chl_backend.model.Player;
import com.escapegame.chl_backend.model.PuzzleAttempt;
import com.escapegame.chl_backend.model.User;
import com.escapegame.chl_backend.repository.EnigmaRepository;
import com.escapegame.chl_backend.repository.GameSessionRepository;
import com.escapegame.chl_backend.repository.PuzzleAttemptRepository;
import com.escapegame.chl_backend.repository.UserRepository;

@Service
public class GameService {

    @Autowired private GameSessionRepository sessionRepository;
    @Autowired private PuzzleAttemptRepository attemptRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EnigmaRepository enigmaRepository;

    public GameSession startGame(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!(user instanceof Player)) {
            throw new RuntimeException("Seuls les joueurs peuvent démarrer une partie.");
        }

        Player player = (Player) user;

        // Si une session est déjà ouverte, la terminer proprement
        sessionRepository.findFirstByPlayerAndDateFinIsNullOrderByDateDebutDesc(player)
                .ifPresent(s -> {
                    s.setDateFin(LocalDateTime.now());
                    long seconds = Duration.between(s.getDateDebut(), s.getDateFin()).getSeconds();
                    s.setTempsEnLigne((int) seconds);
                    sessionRepository.save(s);
                });

        GameSession session = new GameSession();
        session.setPlayer(player);
        session.setDateDebut(LocalDateTime.now());

        return sessionRepository.save(session);
    }

    public boolean validatePuzzle(String email, PuzzleSubmissionDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        GameSession session = sessionRepository
                .findFirstByPlayerAndDateFinIsNullOrderByDateDebutDesc((Player) user)
                .orElseThrow(() -> new RuntimeException("Aucune session active trouvée."));

        Long enigmaId;
        try {
            enigmaId = Long.parseLong(request.getPuzzleId());
        } catch (NumberFormatException e) {
            throw new RuntimeException("ID d'énigme invalide: " + request.getPuzzleId());
        }

        Enigma enigma = enigmaRepository.findById(enigmaId)
                .orElseThrow(() -> new RuntimeException("Énigme non trouvée."));

        // La réponse peut être "SUCCESS" (envoyée par le front après validation in-game)
        // ou la réponse réelle à comparer
        boolean isCorrect;
        String answer = request.getAnswer();

        if ("SUCCESS".equalsIgnoreCase(answer)) {
            // Le front a déjà validé la réponse dans l'enigme, on fait confiance
            isCorrect = true;
        } else if ("FAIL".equalsIgnoreCase(answer)) {
            isCorrect = false;
        } else {
            // Vérification classique de la réponse
            isCorrect = enigma.getReponseAttendue() != null &&
                        enigma.getReponseAttendue().equalsIgnoreCase(answer);
        }

        // Calculer le temps passé depuis le début de la session
        int tempsPasseSec = (int) Duration.between(session.getDateDebut(), LocalDateTime.now()).getSeconds();

        PuzzleAttempt attempt = new PuzzleAttempt();
        attempt.setSession(session);
        attempt.setEnigma(enigma);
        attempt.setEstReussi(isCorrect);
        attempt.setScoreFinal(isCorrect ? 100 : 0);
        attempt.setTempsPasseSec(tempsPasseSec);
        attemptRepository.save(attempt);

        return isCorrect;
    }

    public GameSession endGame(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Si pas de session active, retourner la dernière session (déjà terminée)
        GameSession session = sessionRepository
                .findFirstByPlayerAndDateFinIsNullOrderByDateDebutDesc((Player) user)
                .orElseThrow(() -> new RuntimeException("Aucune session active trouvée."));

        session.setDateFin(LocalDateTime.now());

        long seconds = Duration.between(session.getDateDebut(), session.getDateFin()).getSeconds();
        session.setTempsEnLigne((int) seconds);

        return sessionRepository.save(session);
    }
}