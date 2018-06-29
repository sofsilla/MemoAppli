// Valeurs valables pour le mode LABO
//========================================

// Valeurs par défaut :
DEF_items_min = 5;
DEF_items_max = 10;
DEF_display_time_mem_sti_min = 2000;
DEF_display_time_mem_sti_max = 2000;
DEF_display_time_mem_sti_step = 0;
DEF_items_pause_min = 1000;
DEF_items_pause_max = 1000;
DEF_items_pause_step = 0;
DEF_distracteur_min = 2;
DEF_distracteur_max = 2;
DEF_distracteur_step = 0;
DEF_distracteur_elt_min = 4;
DEF_distracteur_elt_max = 4;
DEF_distracteur_elt_display = 500;
DEF_distracteur_elt_pause = 300;
DEF_answ_display_time = 3000;
DEF_delta_proposed_answ_min = 2;
DEF_cognitif_cost_1 = 0.3;
DEF_cognitif_cost_2 = 0.5;
DEF_cognitif_cost_3 = 0.7;
DEF_cognitif_cost_4 = "";
DEF_repeat = 5;
DEF_distractor_size = 4;
DEF_distractor_distance = 30;
DEF_random_factorial = false;
DEF_type_recall = "keyboard_voice";

// Taux de réussite requis à l'entraînement :
// Si ce taux est égal à 0, l'entraînement 
// n'est pas obligatoire.
var training_score_min = 75;

// Inhibe la possibilité de paramétrer 
// l'appli en cachant le menu "Paramétrage"
var MODE_KIOSK = true;

// Envoi de mail ou non.
// Note : Quel que soit cette valeur, il n'y a 
// pas d'envoi de mail en mode entraînement.s
var SEND_MAIL = true;
var MAIL_ADRESS = 'memoappli@alwaysdata.net';