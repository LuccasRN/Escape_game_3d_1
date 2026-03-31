const fs = require('fs');
let file = fs.readFileSync('src/App.vue', 'utf8');

// Fix Desktop Icons & Accents
file = file.replace(/<span class="icon-emoji">\?\?<\/span>([\s\S]*?)<span class="icon-text">Mes Documents<\/span>/g, '<span class="icon-emoji"></span>$1<span class="icon-text">Mes Documents</span>');
file = file.replace(/<span class="icon-emoji">\?\?<\/span>([\s\S]*?)<span class="icon-text">Rseau Local<\/span>/g, '<span class="icon-emoji"></span>$1<span class="icon-text">Réseau Local</span>');
file = file.replace(/<span class="icon-emoji">\?\?<\/span>([\s\S]*?)<span class="icon-text">Systme<\/span>/g, '<span class="icon-emoji"></span>$1<span class="icon-text">Système</span>');

file = file.replace(/Rseau/g, 'Réseau');
file = file.replace(/Systme/g, 'Système');
file = file.replace(/t/g, 'été');
file = file.replace(/purgs/g, 'purgés');
file = file.replace(/scurit/g, 'sécurité');
file = file.replace(/Dmarrer/g, 'Démarrer');
file = file.replace(/Eteindre l'cran/g, "Eteindre l'écran");
file = file.replace(/Proprits Systme/g, 'Propriétés Système');
file = file.replace(/Flicitations/g, 'Félicitations');
file = file.replace(/tapes/g, 'étapes');
file = file.replace(/dcs/g, 'décès');
file = file.replace(/mdicamenteux/g, 'médicamenteux');
file = file.replace(/Complmentaires/g, 'Complémentaires');
file = file.replace(/aigu/g, 'aiguë');
file = file.replace(/bactrienne/g, 'bactérienne');
file = file.replace(/Bactriologie/g, 'Bactériologie');
file = file.replace(/Ngative/g, 'Négative');
file = file.replace(/lie/g, 'liée');
file = file.replace(/ /g, 'à ');
file = file.replace(/DCS/g, 'DÉCÈS');
file = file.replace(/srique/g, 'sérique');
file = file.replace(/leve/g, 'élevée');
file = file.replace(/Accs autoris/g, 'Accès autorisé');
file = file.replace(/erron/g, 'erroné');

file = file.replace(/<span class="icon-emoji">\?\?<\/span>\s*<span class="icon-text">Clôture Enquête<\/span>/g, '<span class="icon-emoji"></span>\n            <span class="icon-text">Clôture Enquête</span>');

fs.writeFileSync('src/App.vue', file, 'utf8');
console.log('Done replacement');
