---
title: Robotique
description: Mon projet de main robotique
date: '2026-08-07'
---

# Main robotique

> *We are not interested in the fact that the brain has the consistency of cold porridge.*
>
> *Alan Turing  -  1952*

Le 16 juillet 1945, à 5h29 du matin est déclenché le premier essai de bombe atomique de l'histoire de l'humanité. La tristement célèbre expérience de Trinity est un exemple singulier d'une rencontre entre théorie et pratique. Le mariage fatal d'équations de physique nucléaire et de gravats radioactifs. On peut s'extasier face à la beauté des libertés créatives que nous offre notre imagination, comme on peut s'édifier face à la brutalité et à la rudesse de notre réalité. Mais il est souvent difficile de mesurer à quel point faire se croiser ces deux mondes relève du défi. Pendant longtemps, je me suis intéressé à l'élégance des raisonnements, aux émotions de l'esthétique, à la grandeur des abstractions. La matière, elle, me semblait plus intimidante. Moins joueuse. Voire même, indomptable.

Sauf qu'aujourd'hui, plus rien ne semble totalement inaccessible. La robotique s'est largement démocratisée au grand public grâce à des initiatives open source comme le [Poppy Project](https://poppy-project.org) ou les développements de [Pollen Robotics](https://pollen-robotics.com/). C'est d'ailleurs la main robotique de ces derniers que j'ai décidé de fabriquer : l'occasion parfaite de donner une incarnation physique à des lignes de code. Venez avec moi dans mon aventure en robotique.

Tout d'abord, ce projet n'est pas encore terminé. Je souhaite simplement faire un petit bilan puisque j'ai quelques choses à montrer. Aussi cela va me permettre de faire un état de là où j'en suis et de préparer la suite du projet. Ensuite, concernant les origines du projet c'est une vidéo de [Defend Intelligence](https://www.youtube.com/watch?v=HpfKHqlA5Cg) qui présente la [Amazing Hand](https://github.com/pollen-robotics/AmazingHand/tree/Amazing-Hand-Enhanced/) et qui m'a donné envie de me lancer dans sa réalisation. C'est une excellente porte d'entrée dans la robotique et permet comme cela a été introduit, de faire un lien entre réel et virtuel.

J'ai donc commencé par commander quelques pièces et ma première grande interrogation sur la faisabilité de ce projet a été le contrôle des servomoteurs. En regardant le projet je me suis orienté sur la réalisation de la version *enhanced*, utilisant des servomoteurs plus performants. J'ai donc commandé les moteurs ainsi que les controleurs mais j'ai fait une erreur dans le choix de l'alimentation de la carte électronique. Après plusieurs tests infructueux, j'ai décidé de brancher une alimentation d'ordinateur portable : j'ai perdu un servomoteur dans l'opération et je me suis rendu compte que l'idée était assez bête au passage. Suite à cela j'ai pris la bonne alimentation et j'ai pu contrôler mes premiers servomoteurs (les Feetech STS3032). À partir de là, je me suis dis que le projet était tout à fait possible, je n'étais en réalité qu'au début de mon aventure en robotique.

La prochaine étape était donc d'imprimer les pièces en 3D, un chantier encore en cours à l'heure où j'écris ces lignes. Je me suis inscrit dans un club de bricolage pour avoir accès à une imprimante. Seulement, l'imprimante est partagée et on ne peut l'utiliser que durant les horaires du club qui ne correspondent pas toujours à mes horaires. Malgré tout, après quelques essais pour calibrer la rétractation et les paramètres d'impression, j'ai réussi à sortir mes premières pièces et à assembler un premier doigt complet.

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">

  <img src="/journal/robotic/ai-first-finger-overview.webp" alt="Doigt robotique" class="w-full max-w-md rounded-xl shadow-lg"/>

  <video src="/journal/robotic/first-finger-action.mp4" controls muted loop class="w-full max-w-md rounded-xl shadow-lg"></video>

</div>

J'ai ensuite monté les servomoteurs et relié le tout à mon ordinateur. C'est là que le virtuel a enfin pris vie : grâce à un premier script, j'enregistre les positions clés du doigt en le manipulant, puis un second script exécute une séquence d'animation pour les rejouer en boucle.

Le défi suivant était de donner une forme d'intelligence à cette main. C'est un chantier titanesque, alors j'ai commencé par une étape simple.

L'idée est de pouvoir communiquer avec le robot pour le guider. J'ai préconfiguré quelques actions de base (bouger le doigt, l'ouvrir, le fermer) que j'ai mises à disposition d'un LLM sous forme d'outils (*function calling*). De cette façon, lorsque j'envoie un message à la machine, elle déclenche une action physique sur le robot en plus de sa réponse textuelle.

On peut voir avec quelques exemple : 
<div class="flex flex-col md:flex-row gap-6 items-start my-6">
  
  <div class="w-full max-w-md md:w-1/2">

  ```text
  Vous > Es tu prêts à faire ma vaisselle ?
  -> [Exécution] play_animation({'anim_name': 'shake_no'})...
  Kimi > *(J'oscille de gauche à droite pour marquer mon refus)*

  Hélas, non ! Je suis une main robotique, pas un lave-vaisselle… Je peux pointer, saisir, ou réfléchir (bien que cela soit plutôt métaphorique), mais frotter les assiettes et tenir une éponge ne fait pas partie de mes talents. Désolé !
  ```
  
  </div>

  <video src="/journal/robotic/first-finger-no.mp4" controls muted loop class="w-full max-w-md md:w-1/2 rounded-xl shadow-lg"></video>

</div>

Ici le robot a effectivement oscillé négativement le doigt pour marquer son refus en plus de donner une réponse en accord. On notera qu'il reste beaucoup de travail pour rendre le projet réellement utile..

<div class="flex flex-col md:flex-row gap-6 items-start my-6">
  
  <div class="max-w-md md:w-1/2 shrink-0">

  ```
  Vous > Es tu un robot intelligent ?
  -> [Exécution] play_animation({'anim_name': 'nod'})...
  Kimi > (Je viens de hocher « oui » pour confirmer.)
  ```
  </div>

  <video src="/journal/robotic/first-finger-yes.mp4" controls muted loop class="w-full max-w-md md:w-1/2 rounded-xl shadow-lg"></video>

</div>

Ici encore, on a la démonstration d'une autre animation qu'utilise le robot avec sa réponse.

Cette approche par LLM reste toutefois limitée : le modèle ne "comprend" pas l'espace qui l'entoure. Pour aller plus loin, mon objectif est d'explorer les modèles mondes (*world models*), qui se focalisent sur la prédiction au sein d'un espace latent plutôt que sur la simple génération de texte

Dans cet esprit, j'aimerais intégrer un module de vision pour alimenter cet espace latent. Cela permettrait de donner une réelle autonomie au robot et de lui offrir une représentation concrète de son environnement. Le projet reste extrêmement ambitieux, mais c'est là que l'aventure devient fascinante.

La priorité reste donc de terminer l'impression des pièces. J'ai également pour projet de poursuivre la construction du robot au-delà des plans de Pollen Robotics. Cela pourrait passer par la conception d'autres éléments comme un poignet ou un coude. Dans la construction de cette main, chaque petite étape est une victoire formidable et j'apprécie travailler dans ce domaine qui est assez nouveau pour moi. Je pense donc continuer à écrire sur ce sujet de robotique et partager mes avancées ici.


