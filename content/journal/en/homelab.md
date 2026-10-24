---
title: My cloud native homelab
description: An overview of my cloud native homelab
date: '2026-08-17'
---

> *We must cultivate our garden.*
>
> Voltaire - 1759

## Virtualisation or containerisation?

Virtualisation is a technology that makes it possible to create virtual, simulated environments out of a single physical machine. In a business context, it allows you to make the most of a machine's capacity by distributing its resources across several isolated environments. In practice you use a hypervisor, which exposes the physical hardware through virtual interfaces: VMware vSphere, Proxmox or Hyper-V being the best known.

A more modern approach consists in virtualising not a complete machine, but only its operating system along with the most essential components. Containerisation therefore lets you deploy smaller, lighter and better performing environments, at the cost of slightly less watertight isolation between host and guest.

The main advantage of virtualisation today is that it adapts to any piece of software. There is no need to build a specific image for every version of every application, which makes it very easy to accommodate legacy usage. Kubernetes fits this logic very well: you deploy a platform on top of the existing virtualisation infrastructure, the Kubernetes nodes themselves being virtual machines.

But this line of thinking led me to another question: **what would happen if, instead of adding Kubernetes on top of a virtualised infrastructure, you started directly from an infrastructure designed around containers?**

Since I have no legacy to preserve, starting from scratch, I took on that challenge. The purpose of this article is to present the architecture of my homelab as well as the first projects built on and around it.

## A fresh start

Let's start with the hardware constraints. All I have at my disposal is a single salvaged computer fitted with an AMD A10-9700 RADEON R7, a 7th generation processor dating back to 2016, built on a 28 nm process and clocked at 3.5 GHz, along with 8 GB of DDR4 RAM and a 256 GB SATA SSD. Memory is what is most likely to limit me, and that constraint steers me towards solutions that work even if they offer fewer features.

My idea is to host small applications that I will eventually be able to *scale out* with other, more powerful nodes, in a cluster. This clearly follows a *cloud native* logic, with an infrastructure I can redeploy easily and quickly.

My homelab is therefore built around a Kubernetes environment. I went with **k3s**, a lightweight distribution maintained by Rancher, well suited to a single-node cluster. It is obviously not a highly available infrastructure, and that is not the point: what I am after above all is an environment close enough to a real cluster to learn, experiment, and most importantly use day to day. With 8 GB of RAM, every additional component has to justify its existence.

To make the cluster easier to evolve, it seemed sensible to set up a GitOps architecture and *infrastructure as code*. The idea is to describe the infrastructure in a git repository that can then be developed over time: you can follow the cluster's evolution commit after commit, and roll back if needed.

Finally, I want to install Longhorn from the start in anticipation of expanding the cluster, even though it does not really make sense with a single node. Networking is handled by Traefik, which centralises access to the applications rather than configuring each service individually.

These elements are summarised in the following diagram:

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">

  <img src="/journal/infra/infra-overview.webp" alt="Infrastructure diagram" class="w-full max-w-md rounded-xl shadow-lg"/>

</div>

The goal is to bring as many of the services that keep my homelab running as possible into Kubernetes, rather than multiplying dedicated machines for each function. Forgejo, the registry, the CI/CD tooling and my personal applications are all designed as cluster workloads. Whether it is a platform component or an application I wrote myself, the principle stays the same: the application is containerised, its configuration is declared, and Kubernetes takes care of maintaining the desired state.

## My use case: CI/CD

I could go through every service I would like to set up — [*Awesome selfhosted*](https://github.com/awesome-selfhosted/awesome-selfhosted) lists a plethora of more or less useful ones. For my part, I had a very specific objective in mind: configuring a complete CI/CD pipeline on my cluster.

For that I needed:

- a self-hosted git to host my code
- a runner in the cluster to build the images
- a local repository to publish and pull the images built beforehand
- automatic deployment of the latest available versions within the cluster

For git, the cluster uses [Forgejo](https://forgejo.org/), a fork of Gitea. It is lightweight and integrating a runner with it is more straightforward. GitLab would have offered more features but would surely have been too heavy for my machine. So I use the Forgejo runner provided by Codeberg, with [BuildKit](https://github.com/moby/buildkit) to build the images, which are then published to a minimal local registry.

To manage the cluster I use FluxCD, again chosen for how lightweight it is. A GitHub repository holds the YAML files describing my infrastructure, and FluxCD takes care of the `kubectl apply` calls needed for everything to fall into place. It also watches the registry in order to detect new images and automatically deploy the new version to the cluster.

In practice, the journey starts with a simple `git push` and the whole chain unfolds without any action on my part:

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">
  <img src="/journal/infra/infra-ci-cd-pipeline.webp" alt="CI/CD pipeline diagram" class="w-full max-w-md rounded-xl shadow-lg"/>
</div>

This pipeline is ultimately fairly standard. It is nonetheless an excellent first use case, since it brings in almost every building block of the architecture: the registry, containers, Kubernetes, GitOps, declarative configuration and automatic reconciliation. Above all, it lets me verify that they really do work together. This is probably the moment where my whole architecture starts to make sense: each component has a precise role, but it is their combination that produces an automated platform.

## Storage

Storage management is obviously a fundamental topic when building a homelab. I intend to put very diverse data on my cluster: configurations, home-grown applications, but also backups and personal files.

A Kubernetes cluster is perfectly capable of handling persistent storage with *Persistent Volume Claims* and a solution like Longhorn. That does not mean, however, that Kubernetes should become the place where all my data lives. So I plan to separate two kinds of data: heavy, persistent data (photos, videos, databases) and everything else.

Take the case of [Immich](https://immich.app/), which lets you back up and manage your photos and videos. It seems worthwhile to keep the media on a separate NAS and the application's configuration files on a PVC in the cluster. The same reasoning applies to Jellyfin: the data the application needs to run stays on Longhorn, while the films and series have no reason to take up space on the cluster's disks.

With that in mind, I plan to set up a NAS for storing heavy data. Using a NAS does not solve the backup problem though: it only moves the data to another machine. So I also intend to set up offsite backups, in this case to a NAS at my parents' place, in order to get real physical separation between the primary data and its copy.

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">

  <img src="/journal/infra/infra-storage-strategy.webp" alt="Storage diagram within the infrastructure" class="w-full max-w-md rounded-xl shadow-lg"/>
  <img src="/journal/infra/infra-backup-target.webp" alt="Backup diagram" class="w-full max-w-md rounded-xl shadow-lg"/>

</div>

The result is a form of data tiering. Application configurations live only in the cluster, with Longhorn replication once there are more nodes. Personal data such as photos or documents is stored on a NAS with disk redundancy and backed up to a remote site. Finally, the infrastructure description is itself backed up to a remote GitHub repository.

This organisation also forces me to answer an important question right now: **what actually needs to be backed up?** The code and the configuration are already in Git and can be rebuilt. Application data, on the other hand, absolutely has to be restorable.

## An infrastructure under construction

With this first machine I have therefore been able to set up a complete CI/CD pipeline allowing me to deploy my own applications to my k3s cluster. But this is only the beginning, and plenty of work still lies ahead:

- add worker nodes to the cluster / upgrade the existing machine
- set up a NAS for large volumes
- back up my data to a remote NAS
- add monitoring and alerting
- strengthen network isolation
- improve the security of the build and deployment chain
- move the registry to a complete solution such as Harbor
- manage certificates through my domain
- set up a local DNS to resolve my applications on the local network

This is not an oversight: I am not trying to build a perfect infrastructure from day one. I would rather start with a simple but working system, then add each building block when I genuinely need it. The whole point of Kubernetes is precisely to allow that gradual evolution, with applications remaining described declaratively and able to be moved or replicated onto new nodes without calling their deployment model into question.

I ran into no major problems while setting up the cluster. My main difficulties concerned the Forgejo runner and buildkitd, since I did not want to install a Docker environment on the cluster hosts. Using FluxCD to describe the infrastructure, on the other hand, is a real pleasure: the cluster is documented naturally and changes can easily be rolled back. That strikes me as indispensable for building a clean cluster.

Ultimately, this project lets me experiment with Kubernetes configurations in a test environment with real stakes for me: watching my application deploy automatically when I merge into the main branch. This learning tool will be able to host many services that I will use at home, in a cloud native environment rather than merely a virtual one.

So it is less a fixed architecture than a project that will evolve with my needs and with what I learn from running it. I intend to keep it going and to document my progress here. I am also discovering [k9s](https://k9scli.io/), an absolutely brilliant tool, and I'll leave a screenshot of it here.

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">
  <img src="/journal/infra/k9s-overview.webp" alt="Overview of the k9s interface" class="w-full max-w-md rounded-xl shadow-lg"/>
</div>