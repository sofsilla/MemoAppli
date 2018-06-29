
// Instructions : Le format est HTML, séparer les panneaux par une virgule
// ex : ["Bienvenue sur le panneau 1" , "Voici le panneau 2" , "Ceci est le panneau 3"]
var INSTRUCTIONS =[
	"<div class='center center-content'>"
	+ "<p> Dans ce test, des images d'aliments et leurs noms vont apparaitre au centre de l'écran.</p>"
	+ "<p>Vous devrez nommer cet aliment à <strong>voix haute</strong> lorsqu'il sera affiché.</p>"
	+ "<img src='res/img/ingredient/banane.png' class='instruction_img'></img>"
	+ "<p class='small'><strong>BANANE</strong></p>"
	+ "</div>"
	,
	"<div class='center center-content'>"
	+ "<p> Entre chaque d'aliment, une ou plusieurs suites d'images représentant des visages ou des cercles vont apparaitre au centre de l'écran.</p>"
	+ "<p>Vous devrez compter le nombre de visages affichés et répondre \"oui\" ou \"non\" à une question de type : </p>"
	+ "<strong style='color:blue'>Combient de visage avez-vous vu ? <br/>4?</strong><br/>"
	+ "<p>ATTENTION, vous aurez un temps limité pour répondre.</p>"
	+ "</div>"
];

// Label affichés durant un essai
var READY_MSG =	"Lorsque vous êtes prêt, appuyez sur le bouton pour commencer l'expérience.";
var ITEM_PAUSE_DISPLAY = "<img style='width:50px' src='res/img/wait.gif' alt='wait'>";
var DISTRACT_QUESTION_DISPLAY = "Combient de visage avez-vous vu ?";
var DISTRACT_PAUSE_DISPLAY = "<img style='width:50px' src='res/img/wait.gif' alt='wait'>";
var GLOBAL_RECALL_QUESTION_DISPLAY = "Quel(s) ingrédient(s) avez-vous vu ?";
var GLOBAL_RECALL_QUESTION_DISPLAY_ANIM = "Quels animaux avez-vous vu ?";

// Groupe d'ingrédients
var IMAGES_STORE = new Array();
var items = "abricot,ail,amande,ananas,artichaut,aubergine,avocat,bacon,banane,basilic,betterave,beurre,boulghour,brioche,brocoli,brugnon,butternut,cacao,café,cannelle,carotte,cassis,cerise,champignon,chantilly,chataigne,chocolat,chorizo,chou de bruxelles,chou rouge,chou-fleur,chou,ciboulette,citron vert,citron,citrouille,concombre,cornichon,crevette,céleri,céréale,dattes,emmental,farine,fenouille,fraise,framboise,fromage blanc,goyave,grenade,groseille,haricot blanc,haricot rouge,haricot vert,kaki,ketchup,kiwi,lait,lentille corail,lentille noir,lentille verte,mandarine,mangue,mayonnaise,maïs,menthe,miel,moule,mozzarella,myrtille,mûre,noisette,noix de cajou,noix de coco,noix de saint jacques,noix,nouille,oignon blanc,oignon rouge,oignon,olive,orange,pain,pamplemousse,papaye,pastèque,patate douce,piment rouge,piment vert,pistache,poire,poireau,pois chiche,poivron jaune,poivron rouge,poivron vert,pomme de terre,pomme rouge,pomme verte,popcorn,potimarron,poulet,prune,pâtes,pêche,quinoa,raisin noir,raisin rouge,raisin vert,rhubarbe,riz,salade verte,saucisson,saumon,sel,sucre,tomate cerise,tomate,viande,œuf";
items.split(",").forEach( function(item){
	IMAGES_STORE.push({ uri: "res/img/ingredient/"+item+".png", name :item});
});

// Groupe d'animaux
var IMAGES_STORE_ANIM = new Array();
var anim = "aigle,cerf,chameau,chat,chauve-souris,chien,cochon,coq,corbeau,crabe,crocodile,dauphin,escargot,faucon,girafe,gorille,grenouille,guépard,hibou,hippopotame,hérisson,jaguar,lapin,lion,loup,lynx,léopard,oiseau,orque,ours,panda,pieuvre,poule,raton laveur,requin,rhinocéros,sanglier,singe,souris,tigre,tortue,vache,zèbre,âne,écureuil,éléphant";
anim.split(",").forEach( function(item){
	IMAGES_STORE_ANIM.push({ uri: "res/img/animaux/"+item+".png", name :item});
});

// Image des distracteur
var DISTRACTORS_STORE = new Array();
DISTRACTORS_STORE.push({ uri: "res/img/distracteur/smiley/face.jpg", name :"conviveSE"});

// Image des leurre
var CROSS_STORE = new Array();
CROSS_STORE.push({ uri: "res/img/distracteur/smiley/circle.jpg", name :"croixO"});

// Panneau de bienvenu
var WELCOM_PANE =
"<div class='jumbotron'>"
+"	<h1 class='display-4'>Bienvenue</h1>"
+"	<p class='lead'>Cette application propose des séries d'expérience de mémorisation.</p>"
+"	<hr class='my-4'/>						"
+"		<div class='text-center'> "
+"		    <button class='btn btn-success btn-lg margin-1' onClick='startExp(\"start\")' >"
+"		    	Commencer"
+"		    </button> "
+"		    <button class='btn btn-primary btn-lg margin-1' onClick='startExp(\"training\")' >"
+"			    S'entraîner "
+"			</button> "
+"		    <button class='btn btn-info btn-lg margin-1' onClick='startExp(\"skip\")' >"
+"		    	Passer les instructions"
+"		    </button> "
+"		</div>"
+"</div>";
