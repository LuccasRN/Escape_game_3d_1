function send() {

    // recupération des valeurs
    var val = document.getElementById("password").value;

    // en majuscules
    var result = val.toUpperCase();


    if (result == "") {
        // message erreur champ vide
        msg('02');
        open_msg();

    } else if (result == "LEAOSLO1975") {
        // ouverture de la page
        opendoc();

    } else {
        // message erreur 
        msg('01');
        open_msg();
    }

}

function mdplost() {

    // affichage box avec instructions
    msg('03');
    open_msg();

}

function open_msg() {

    // afficher bouton
    document.getElementById("b-bottom-01").style.display = 'block';

    // open box
    document.getElementById("b-msg").style.display = 'block';
    document.getElementById("dialog-box").style.display = 'block';

}

function closebox() {

    // fermeture de la box 
    document.getElementById("dialog-box").style.display = 'none';
    // masquer bouton
    document.getElementById("b-bottom-01").style.display = 'none';

}

function msg(val) {

    switch (val) {
        case '01':
            // afficher message dans box
            document.getElementById("b-msg").innerHTML = "<p><span>Erreur : </span><br>mot de passe incorrect.</p>";

            // afficher bouton
            document.getElementById("b-bottom-01").style.display = 'block';

            break;

        case '02':
            // afficher message dans box
            document.getElementById("b-msg").innerHTML = "<p><span>Erreur : </span><br>Champ vide.</p>";

            // afficher bouton
            document.getElementById("b-bottom-01").style.display = 'block';

            break;

        case '03':
            // afficher message dans box
            document.getElementById("b-msg").innerHTML = "<p>FILLE + CHIEN + MONANNEEDENAISSANCE</p>";

            // afficher bouton
            document.getElementById("b-bottom-01").style.display = 'block';

            break;

    }
}

function opendoc() {

    //reset value
    document.getElementById("password").value = "";

    // open box
    document.getElementById("serveur-box").style.display = 'block';

}

function msginfos(numd) {

    switch (numd) {
        case '01':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Dossier de Mr Almerac M. clôturé.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '02':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Suite au bilan réalisé par le Dr Reboul, des analyses sanguines ont été effectuées. Le traitement de Mr Auzias J. sera MAJ en fonction des résultats.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '03':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Dossier de Mme Beynat L. clôturé.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '04':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Le traitement de Mr Brand C. a été MAJ. Nous gardons le patient en observation encore 48h.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;


        case '05':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Suite à la radiographie des poumons et des analyses sanguines, nous pouvons affirmer que Mme Calvin souffre d'une GRIPPE (ALTERNATIVE AINS).</p>";
            // Check if chest was unlocked to show FTP access
            if (localStorage.getItem('chestUnlocked') === 'true') {
                document.getElementById("sbr-bottom").innerHTML = "<img src='images/sftp.png' style='cursor:pointer;' onclick='openFTP()' title='Cliquez pour ouvrir le client FTP'/><p style='color:#50ef87;font-size:11px;margin-top:5px;'>✓ Accès FTP débloqué - Utilisez <b>connect IP:Port</b></p>";
            } else {
                document.getElementById("sbr-bottom").innerHTML = "<img src='images/sftp.png' style='opacity:0.5;'/><p style='color:#ff6b6b;font-size:11px;margin-top:5px;'>🔒 Accès FTP verrouillé - Ouvrez le coffre</p>";
            }
            break;

        case '06':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Dossier de Mme Garreau I. clôturé.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '07':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Dossier de Mr Lorentz G. clôturé.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '08':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Le patient Mr Rolet R. reste sous surveillance. Pas d'évolution des symptômes à ce jour.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '09':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Dossier de Mme Sudre E. clôturé.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;

        case '10':
            // afficher message dans box
            document.getElementById("sbrt-content").innerHTML = "<p>Dossier de Mr Tourbet A. clôturé.</p>";
            document.getElementById("sbr-bottom").innerHTML = "<img src='images/locked.png'/>";
            break;
    }
}

function openFTP() {
    // Navigate to FTP interface
    window.location.href = '/ftp-interface/index.html';
}
