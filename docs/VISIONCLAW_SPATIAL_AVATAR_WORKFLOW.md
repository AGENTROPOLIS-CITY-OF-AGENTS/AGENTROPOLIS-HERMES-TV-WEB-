# VisionClaw spatial avatar and Agentic TV workflow
Status: PROPOSED integration contract. Documentation only; not evidence of working AR, VR, photo reconstruction, pairing, device control, or live hazard detection.

## Ownership
Infrastructure: Hermes dispatch, AEGIS/54T authorization, receipts and Math54 coordinate conventions.
Construction District / Creator Foundry: character assets, rigs, animation preparation and export.
Applications: Human OS room experience and Agentic TV presentation. VisionClaw is the existing perception foundation, not a new district.

## Production sequence
1. Intake: use an owned or authorized portrait, Blender character, or licensed model. Record source, license, permitted uses, consent and retention. A portrait is not a mesh; photo-to-3D is a separate optional adapter. Label reconstructed unseen features as generated.
2. Prepare in Blender: inspect mesh, textures, scale, orientation and rest pose. Keep source files separate from delivery assets.
3. Rig and animate in Mesh2Motion: import a supported model, choose a compatible skeleton, position bones, preview deformation and select available clips. Unusual anatomy may need manual correction. Body animation does not provide facial animation or lip-sync.
4. Export animated GLB with named clips. Preserve license evidence separately. Reopen in Blender and the target viewer to inspect textures, bones, foot contact, clipping, scale and animation loops.
5. Room placement: explicitly start a camera session. VisionClaw observations may suggest objects or markers; an AR tracking adapter must establish and maintain the room anchor. Never use an AI object guess as authorization or proof of presence.
6. Hermes interaction: route user intent through scoped permissions. Map approved presentation events to existing clips; reject unknown clip names. Conversation, memory, speech and lip-sync are separate adapters.
7. Agentic TV: pair an authorized viewer with the room session. The TV shows a digital room or an explicitly shared phone camera view. It does not project a hologram or automatically run Hermes locally.
8. End session: stop capture, revoke sharing, expire pairing and apply the selected deletion policy. Record a receipt without raw portraits, frames or precise room coordinates.

## Spatial contract
Record units (meters), coordinate-frame ID, handedness, up axis, origin, anchor transform, timestamp, tracking state and measurement uncertainty.
Use the existing Math54 implementation after inspection; do not invent a replacement rounding convention. Preserve continuous tracker coordinates for rendering. Grid indices are derived metadata, not claims of sensor accuracy. Recalibrate or pause placement when tracking is lost.
LiDAR/depth is optional and device-dependent. Camera-only placement and a manually positioned 3D preview must be labeled distinctly.

## Integration boundaries
Creator -> approved asset reference + source/license receipt + available clip names.
VisionClaw -> user-approved observation + timestamp + confidence + source; no implicit tool command.
AR adapter -> anchor transform + tracking state + frame ID.
Hermes -> authorized intent and selected clip; no arbitrary script execution from camera text.
TV viewer -> minimal scene state; camera streaming requires separate visible consent.
Private portrait, room scan and device credentials never enter public repository assets.

## Cost and compatibility
Blender and Mesh2Motion provide a no-subscription software route using existing hardware and licensed free assets. This is not a promise of zero inference, generation, hosting, network or hardware costs.
Mesh2Motion: https://mesh2motion.org/
Source: https://github.com/Mesh2Motion/mesh2motion-app
Mesh2Motion can export bundled animation in GLB/FBX; review software and asset licenses independently. A free Sketchfab download is not automatically unrestricted commercial content.
Insignia/Fire TV, Android/Google TV, browsers and headsets require separate capability checks. No universal WebXR, depth sensor or APK support claim.

## Recovery and security
Reuse VisionClaw concepts from wiredchaos/ww3monitor and wiredchaos/schoolofbase after source inspection.
Do not reuse the deprecated JWT-unverified reward write endpoint. Keep perception, identity, reward settlement and execution separate.
Authenticated scoped sessions, explicit camera consent, short-lived pairing, replay protection, revocation and a visible stop control are acceptance requirements.
Do not weaken the Human OS CSP to embed a viewer; review the integration boundary first.
Public T.A.G. templates must remain isolated from protected AGENTROPOLIS implementation and credentials.

## Delivery gates
- [ ] Licensed Blender model -> Mesh2Motion -> GLB -> target viewer validated.
- [ ] Portrait-to-3D adapter independently evaluated, or clearly labeled unavailable.
- [ ] One room, three mapped objects, one avatar; measured scale and anchor persistence verified on hardware.
- [ ] Camera-only fallback and tracking-loss behavior verified.
- [ ] Phone/TV pairing, event ordering, reconnect and revocation verified.
- [ ] One explicitly authorized supported device action completes with a receipt.
- [ ] No facial identification, hidden camera capture or automatic reward authorization.
- [ ] Accessibility: reduced motion, readable TV text, captions and non-voice controls.
- [ ] Security review and human acceptance before production promotion.

Initial milestone: a manually imported animated GLB in a local room preview. AR anchoring, photo reconstruction, runtime interaction and cross-device synchronization remain separate deliverables until verified.

## This repository's responsibility
Public-safe roadmap only. Explain photo/model -> animation -> room session -> TV viewer. Preserve pre-release labels; publish no private implementation, device identifiers, credentials, fabricated APK or live-integration claims.
