# WebsLab Kubernetes Manifests 🧙‍♂️🚀

Welcome to the **WebsLab** deployment repository!  
Here you will find the arcane scrolls (YAML manifests) that summon our infrastructure, database, and application into the cloud—securely, scalably, and with a touch of magic. ✨

---

## 🗂️ Structure

```
deploy/kube/
├── 01-project.yaml         # ArgoCD Project definition
├── 02-appliction.yaml      # ArgoCD ApplicationSet (multi-wave, multi-component)
├── infra/                  # Cluster-wide infra (namespace, issuer, sealed secrets)
├── db/                     # Database (SurrealDB) config, deployment, service
└── app/
    ├── base/               # Kustomize base for the app (config, deployment, service)
    └── overlays/
        └── prod/           # Production overlay (patches, sealed secrets)
```

---

## 🚦 GitOps Flow

1. **ArgoCD Project** defines boundaries and permissions.
2. **ApplicationSet** deploys infra, db, and app in sync-waves:
   - `infra` → `db` → `prod`
3. **Kustomize** overlays allow for environment-specific configuration.
4. **SealedSecrets** keep production secrets safe, but we also believe in developer happiness and transparency.  
   (For dev, we sometimes use plain secrets—because we are open! 🌈)

---

## 🔐 Secrets Philosophy

- **Production:** SealedSecrets (`bitnami.com/v1alpha1`) for safety and compliance.
- **Development:** Plain secrets for speed and simplicity.
- **We trust our team, but we also know how to seal a secret when needed!**

---

## 🗺️ Deployment Diagram

```mermaid
flowchart TD
    Project[ArgoCD Project (webslab)]
    AppSet[ApplicationSet (standalone)]
    Infra[Infra: Namespace, Issuer, SealedSecret]
    DB[Database: SurrealDB, ConfigMap, Secret, Service]
    App[App: Base + Prod Overlay, ConfigMap, Deployment, Service, Ingress, SealedSecrets]
    Base[App Base]
    Prod[App Overlay: Prod]

    Project --> AppSet
    AppSet --> Infra
    Infra --> DB
    DB --> App
    App --> Base
    App --> Prod
```

---

## 📝 How to Deploy

1. **Fork or clone** this repo.
2. **Configure ArgoCD** to point at your fork.
3. **Apply the project and applicationset:**
   ```sh
   kubectl apply -f deploy/kube/01-project.yaml
   kubectl apply -f deploy/kube/02-appliction.yaml
   ```
4. **Watch the magic happen** in the ArgoCD UI! ✨

---

## 🦄 Manifest Magic

- **Sync-waves** ensure infra, db, and app deploy in the right order.
- **Kustomize overlays** make it easy to add new environments (just copy `prod` to `dev` and patch away).
- **ConfigMaps** and **Secrets** keep configuration and sensitive data separate and manageable.
- **Ingress** and **Service** resources expose your app to the world.

---

## 🌈 Philosophy

> We believe in openness,  
> in developer happiness,  
> and in the power of a well-crafted manifest.
>
> Sometimes we seal,  
> sometimes we reveal,  
> but always, we deploy with style!
>
> — The WebsLab Cloud Wizards 🧙‍♂️

---

## 🛠️ Tips & Tricks

- **Update deprecated fields:**  
  Run `kustomize edit fix` in any folder if you see deprecation warnings.
- **Add new environments:**  
  Copy `app/overlays/prod` to `app/overlays/dev` and patch as needed.
- **Rotate secrets:**  
  Reseal with `kubeseal` if you ever change clusters or keys.
- **Add more magic:**  
  PRs welcome! Add emojis, poetry, or even more automation.

---

## 📜 License

Open source, open secrets, open hearts.  
MIT License.

---

## 🧙‍♂️ Final Blessing

> May your pods be ever healthy,  
> Your syncs ever green,  
> And your team ever grateful  
> For your wizardry unseen!
>
> 🚀🦄🌈

---

**Happy shipping, and may the YAML gods smile upon you!**
