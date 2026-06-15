# WearAtlas Clothing Codec Demo

A small interactive demo for a proposed AI-native virtual try-on runtime. The demo illustrates the product architecture:

```text
Persistent BodyCodec + generated GarmentCodec + local WearState patches -> fast renderer
```

It is not a photorealistic model. It is a visual prototype showing why local codec edits can be faster than re-running a full image/video try-on model for every user request.

## Public preview link

I cannot create a public Codex Cloud preview URL directly from this shell because the checkout does not expose a remote repository or hosting-provider credentials. This repo is now ready for GitHub Pages, though:

1. Merge this branch into `main`.
2. In GitHub, go to **Settings -> Pages** and set **Source** to **GitHub Actions**.
3. Run the **Deploy static demo to GitHub Pages** workflow, or push to `main`.
4. GitHub will publish the demo at:

```text
https://<owner>.github.io/<repo>/
```

If this repository is named `practical1211`, the final URL will look like:

```text
https://<owner>.github.io/practical1211/
```

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## What to try

- Change color: updates only the appearance/albedo token.
- Change fit: updates clearance and garment warp tokens.
- Change sleeve length: updates sleeve panels only.
- Open/close: updates front placket WearState.
- Tuck/untuck: updates hem visibility/attachment state.
- Add inner tee: updates layer ordering.
