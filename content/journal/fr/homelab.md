---
title: Mon homelab cloud native
description: Présentation de mon homelab cloud native
date: 08/17/2026
---

> *Il faut cultiver notre jardin.*
>
> Voltaire - 1759

## Virtualisation ou conteneurisation ?

La virtualisation est une technologie permettant de créer des environnements virtuels et simulés à partir d'une seule machine physique. En entreprise, elle permet d'optimiser les capacités d'une machine en distribuant ses ressources entre plusieurs environnements isolés. En pratique on utilise un hyperviseur, qui met à disposition le matériel physique via des interfaces virtuelles : VMware vSphere, Proxmox ou Hyper-V pour les plus connus.

Une approche plus moderne consiste à ne pas virtualiser une machine complète, mais seulement son système d'exploitation avec les composants les plus essentiels. La conteneurisation permet ainsi de déployer des environnements plus petits, plus légers et plus performants, au prix d'une isolation légèrement moins étanche entre hôte et invité.

L'intérêt majeur de la virtualisation aujourd'hui, c'est qu'elle s'adapte à n'importe quel logiciel. Il n'est pas nécessaire de construire une image spécifique pour chaque version de chaque application, ce qui permet d'intégrer très facilement les usages historiques. Kubernetes s'inscrit d'ailleurs très bien dans cette logique : on déploie une plateforme au-dessus de l'infrastructure de virtualisation existante, les nœuds Kubernetes étant eux-mêmes des machines virtuelles.

Mais cette réflexion m'a amené à me poser une autre question : **que se passerait-il si, au lieu d'ajouter Kubernetes au-dessus d'une infrastructure virtualisée, on partait directement d'une infrastructure pensée autour des conteneurs ?**

N'ayant aucun existant à préserver puisque je commence de zéro, je me suis lancé ce défi. L'objet de cet article est de présenter l'architecture de mon homelab ainsi que les premiers projets mis en place dessus et autour.

## Un nouveau départ

Commençons par les contraintes matérielles. Je n'ai à ma disposition qu'un unique ordinateur de récupération équipé d'un AMD A10-9700 RADEON R7, un processeur de 7ème génération datant de 2016, gravé en 28 nm et cadencé à 3.5 GHz, accompagné de 8 Go de RAM DDR4 et d'un SSD SATA de 256 Go. C'est surtout la mémoire qui risque de me limiter, et cette contrainte m'oriente vers des solutions fonctionnelles quitte à offrir moins de fonctionnalités.

Mon idée est d'héberger de petites applications que je pourrai *scale out* à terme avec d'autres nœuds plus puissants, en cluster. Cela répond clairement à une logique *cloud native*, avec une infrastructure que je peux redéployer facilement et rapidement.

Mon homelab s'articule donc autour d'un environnement Kubernetes. J'ai fait le choix de **k3s**, une distribution légère portée par Rancher, adaptée à un cluster mono-nœud. Il ne s'agit évidemment pas d'une infrastructure hautement disponible, et ce n'est pas le but : je cherche avant tout un environnement suffisamment proche d'un vrai cluster pour apprendre, expérimenter, et surtout l'utiliser au quotidien. Avec 8 Go de RAM, chaque composant supplémentaire doit avoir une raison d'être.

Pour faciliter l'évolution du cluster, il m'a paru pertinent de mettre en place une architecture GitOps et de l'*infrastructure as code*. L'idée est de décrire l'infrastructure dans un repository git qu'on fera évoluer par la suite : on voit ainsi l'évolution du cluster au fil des commits, et on peut revenir en arrière si besoin.

Enfin, je souhaite installer Longhorn dès le début en prévision de l'extension du cluster, même si cela n'a pas vraiment de sens avec un unique nœud. La gestion réseau se fait quant à elle via Traefik, qui centralise l'accès aux applications plutôt que de configurer chaque service individuellement.

On peut reprendre ces informations dans le schéma suivant :

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">

  <img src="/journal/infra/infra-overview.webp" alt="Schéma de l'infra" class="w-full max-w-md rounded-xl shadow-lg"/>

</div>

L'objectif est de regrouper autant que possible les services qui font fonctionner mon homelab au sein de Kubernetes, plutôt que de multiplier les machines dédiées à chaque fonction. Forgejo, le registry, les outils de CI/CD ou mes applications personnelles sont ainsi pensés comme des workloads du cluster. Que ce soit une brique de la plateforme ou une application que j'ai développée moi-même, le principe reste le même : l'application est conteneurisée, sa configuration est déclarée, et Kubernetes s'occupe de maintenir l'état souhaité.

## Mon cas d'usage : la CI/CD

On pourrait passer en revue l'ensemble des services que je souhaite mettre en place — [*Awesome selfhosted*](https://github.com/awesome-selfhosted/awesome-selfhosted) recense un nombre pléthorique de services plus ou moins utiles. Pour ma part, j'avais un objectif bien précis en tête : configurer une pipeline CI/CD complète sur mon cluster.

Il me fallait pour cela :

- un git self-hosted pour héberger mon code
- un runner dans le cluster pour construire les images
- un repository local pour publier et récupérer les images construites
- un déploiement automatique des dernières versions disponibles au sein du cluster

Pour le git, le cluster utilise [Forgejo](https://forgejo.org/), un fork de Gitea. Il est léger et l'intégration d'un runner y est plus aisée. Un GitLab aurait offert plus de fonctionnalités mais aurait sûrement été trop lourd pour ma machine. J'utilise donc le runner Forgejo fourni par Codeberg, avec [BuildKit](https://github.com/moby/buildkit) pour construire les images, qui sont ensuite publiées sur un registry local minimal.

Pour gérer le cluster, j'utilise FluxCD, là encore choisi pour sa légèreté. Un repository GitHub contient les fichiers YAML décrivant mon infrastructure, et FluxCD se charge des `kubectl apply` nécessaires pour que tout se mette en place. Il surveille également le registry afin de détecter les nouvelles images et déployer automatiquement la nouvelle version sur le cluster.

Concrètement, le parcours commence par un simple `git push` et la chaîne complète se déroule sans intervention de ma part :

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">
  <img src="/journal/infra/infra-ci-cd-pipeline.webp" alt="Schéma de la pipeline CI/CD" class="w-full max-w-md rounded-xl shadow-lg"/>
</div>

Cette pipeline est finalement assez classique. Elle constitue pourtant un excellent premier cas d'usage, puisqu'elle fait intervenir presque toutes les briques de l'architecture : le registry, les conteneurs, Kubernetes, le GitOps, la configuration déclarative et la réconciliation automatique. Surtout, elle permet de vérifier qu'elles fonctionnent réellement ensemble. C'est probablement le moment où l'ensemble de mon architecture prend son sens : chaque composant a un rôle précis, mais c'est leur combinaison qui donne une plateforme automatisée.

## Le stockage

La gestion du stockage est un sujet évidemment fondamental dans la mise en place d'un homelab. J'ai pour objectif de mettre des données très diverses sur mon cluster : configurations, applications développées maison, mais également des sauvegardes et des fichiers personnels.

Un cluster Kubernetes peut parfaitement gérer du stockage persistant avec des *Persistent Volume Claims* et une solution comme Longhorn. Mais cela ne signifie pas pour autant que Kubernetes doive devenir l'endroit où toutes mes données sont stockées. Je pense donc séparer deux types de données : les données lourdes et persistantes (photos, vidéos, bases de données) et les autres.

Prenons le cas d'[Immich](https://immich.app/), qui permet de sauvegarder et gérer ses photos et vidéos. Il paraît intéressant de conserver les médias sur un NAS à part et les fichiers de configuration de l'application sur un PVC dans le cluster. Le raisonnement vaut aussi pour Jellyfin : les données nécessaires au fonctionnement de l'application restent sur Longhorn, tandis que les films et les séries n'ont pas de raison d'occuper les disques du cluster.

À cet égard, je compte mettre en place un NAS pour le stockage des données lourdes. Utiliser un NAS ne résout cependant pas le problème de la sauvegarde : cela ne fait que déplacer les données vers une autre machine. J'ai donc également pour objectif de mettre en place des sauvegardes externalisées, en l'occurrence vers un NAS chez mes parents, afin d'obtenir une vraie séparation physique entre les données principales et leur copie.

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">

  <img src="/journal/infra/infra-storage-strategy.webp" alt="Schéma du stockage au sein de l'infra" class="w-full max-w-md rounded-xl shadow-lg"/>
  <img src="/journal/infra/infra-backup-target.webp" alt="Schéma du backup" class="w-full max-w-md rounded-xl shadow-lg"/>

</div>

On obtient ainsi une sorte de tiering des données. Les configurations des applications sont uniquement dans le cluster, avec la réplication Longhorn lorsqu'il y aura plus de nœuds. Les données personnelles comme les photos ou les documents sont stockées sur un NAS avec redondance des disques et sauvegardées sur un site distant. Enfin, la description de l'infrastructure est elle-même sauvegardée sur un repository distant GitHub.

Cette organisation force aussi à répondre à une question importante dès maintenant : **qu'est-ce qui doit réellement être sauvegardé ?** Le code et la configuration sont déjà dans Git et peuvent être reconstruits. Les données applicatives, elles, doivent impérativement être restaurables.

## Une infrastructure en construction

Avec cette première machine, j'ai donc pu mettre en place une pipeline CI/CD complète me permettant de déployer mes propres applications dans mon cluster k3s. Mais ce n'est que le début, et de nombreux chantiers m'attendent :

- ajouter des nœuds workers au cluster / améliorer la machine existante
- mettre en place un NAS pour les gros volumes
- sauvegarder mes données sur un NAS distant
- ajouter la supervision et l'alerting
- renforcer l'isolation réseau
- améliorer la sécurité de la chaîne de build et de déploiement
- faire évoluer le registry vers une solution complète comme Harbor
- gérer les certificats via mon domaine
- mettre en place un DNS local pour résoudre mes applications sur le réseau local

Ce n'est pas un oubli : je ne cherche pas à construire une infrastructure parfaite dès le départ. Je préfère partir d'un système simple mais fonctionnel, puis ajouter chaque brique lorsque j'en ai réellement besoin. L'intérêt de Kubernetes est justement de permettre cette évolution progressive, les applications restant décrites de manière déclarative et pouvant être déplacées ou répliquées sur de nouveaux nœuds sans remettre en cause leur mode de déploiement.

Je n'ai pas eu de problème majeur lors de la mise en place du cluster. Mes principales difficultés ont concerné le runner Forgejo et buildkitd, puisque je ne souhaitais pas installer un environnement Docker sur les hôtes du cluster. L'utilisation de FluxCD pour décrire l'infrastructure est en revanche un réel plaisir : le cluster est documenté naturellement et on peut facilement annuler des changements. Cela me paraît indispensable pour faire un cluster propre.

Finalement, ce projet me permet d'expérimenter avec les configurations Kubernetes dans un environnement de test avec un enjeu réel pour moi : voir mon application se déployer automatiquement lorsque je merge sur la branche principale. Cet outil d'apprentissage va pouvoir accueillir de nombreux services que j'utiliserai chez moi, dans un environnement cloud native et pas seulement virtuel.

C'est donc moins une architecture figée qu'un projet qui évoluera avec mes besoins et avec ce que j'apprendrai en le faisant fonctionner. Je compte le poursuivre et documenter mes différentes avancées ici. Je suis d'ailleurs en train de découvrir [k9s](https://k9scli.io/), un outil absolument génial dont je laisse une capture ici.

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">
  <img src="/journal/infra/k9s-overview.webp" alt="Aperçu de l'interface de k9s" class="w-full max-w-md rounded-xl shadow-lg"/>
</div>