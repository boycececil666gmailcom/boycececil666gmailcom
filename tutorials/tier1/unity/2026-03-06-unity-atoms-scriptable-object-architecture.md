# Unity Atoms — ScriptableObject Architecture for Scalable Unity Projects

Unity Atoms is an open-source package by **Adam Ramberg** that gives you a
structured, data-driven way to build Unity games using the
**ScriptableObject Architecture (SOA)** — a pattern popularised by
**Ryan Hipple** in his landmark
[2017 GDC talk](https://www.youtube.com/watch?v=raQ3iHhE_Kk).

The core promise: stop hardwiring references between MonoBehaviours and start
treating your game's state and events as first-class assets that live outside
any scene.

---

## Why ScriptableObject Architecture?

Classic Unity projects quickly accumulate tight coupling: a `PlayerHealth`
script holds a reference to `HealthBar`, which holds a reference to
`AudioManager`, which… you get the idea. Any change ripples everywhere.

SOA breaks this by making three things true of every system:

| Pillar | What it means |
|--------|---------------|
| **Modular** | Systems share data through assets, not direct references. Scenes are clean slates — no `DontDestroyOnLoad` sprawl. |
| **Editable** | Data is externalised into the Inspector. You change gameplay values without touching code, and you can tweak at runtime. |
| **Debuggable** | Modular systems can be tested in isolation. Editable data gives you a natural live debug view. |

---

## The Building Blocks

Unity Atoms provides five primitives that map directly onto these pillars.

### 1. Variables and Constants

A **Variable** stores a typed value (e.g. `IntVariable`, `FloatVariable`,
`BoolVariable`) as a ScriptableObject `.asset`. Because it lives outside any
scene, it is shared global state — injectable via the Inspector.

```csharp
using UnityAtoms.BaseAtoms;

public class PlayerHealth : MonoBehaviour
{
    public IntVariable Health;
}
```

A **Constant** is a read-only Variable. Use it for values like `MaxHealth`
that should never change at runtime.

A **Reference** (`IntReference`) is the most flexible option — the Inspector
lets you switch between a raw inline value, a Variable, or a Constant without
changing any code.

### 2. Events

**Events** are also ScriptableObjects. A Variable automatically exposes two:

- `Changed` — fires every time the value is set, passing the **new** value.
- `Changed With History` — fires with both the **new** and **old** value.

You assign an `IntEvent` asset to the Variable's `Changed` slot, then any
script that cares about health changes subscribes to that event — with zero
knowledge of `PlayerHealth`.

```csharp
// HealthBar listens to the event, not the script that owns health
HealthChangedEvent.Register(this.ChangeFillAmount);
// Always unregister to prevent memory leaks
HealthChangedEvent.Unregister(this.ChangeFillAmount);
```

Raising events from code instead of polling in `Update()` means you only do
work when something actually changes.

### 3. Listeners

Registering and responding in the same script still mixes concerns. **Listeners**
separate them.

An `IntEventReferenceListener` is a MonoBehaviour you add to any GameObject.
You point it at an event asset and wire up any number of responses in the
Inspector — no code changes needed to add or remove a response.

```
HealthListener (GameObject)
  └── IntEventReferenceListener
        ├── Event → HealthChangedEvent (IntEvent asset)
        └── Responses
              └── UnityEvent → HealthBar.ChangeFillAmount
```

`HealthBar.cs` now has a single job:

```csharp
public class HealthBar : MonoBehaviour
{
    [SerializeField] private IntConstant MaxHealth;

    public void ChangeFillAmount(int health)
    {
        GetComponent<Image>().fillAmount = 1.0f * health / MaxHealth.Value;
    }
}
```

No event registration. No teardown. No coupling.

### 4. Actions

A **Response** doesn't have to be a `UnityEvent`. You can make it a
**ScriptableObject Action** — a reusable function packaged as an asset.

```csharp
[CreateAssetMenu(menuName = "Unity Atoms/Examples/Health Logger")]
public class HealthLogger : IntAction
{
    public override void Do(int health)
    {
        Debug.Log("<3: " + health);
    }
}
```

Create a `HealthLogger.asset`, drop it into the Listener's action list.
Reuse the same asset from any Listener in any scene. Play a sound, spawn
particles, trigger an animation — all without writing wiring code.

### 5. Mono Hooks

Unity lifecycle methods (`OnTriggerEnter2D`, `OnCollisionEnter`, `Start`,
`OnDestroy`, etc.) normally require a MonoBehaviour to exist just to forward
the call somewhere. **Mono Hooks** are pre-built MonoBehaviours that raise
Atoms Events for you.

Instead of writing `Harmful.cs`:

```csharp
void OnTriggerEnter2D(Collider2D collider)
{
    if (collider.tag == "Player")
        collider.GetComponent<PlayerHealth>().Health.Value -= 10;
}
```

Attach an `OnTrigger2DHook` to the object, enable **Trigger On Enter**, then
handle the `Collider2DEvent` through a Listener with a `DecreasePlayersHealth`
Action:

```csharp
public class DecreasePlayersHealth : Collider2DAction
{
    public override void Do(Collider2D collider)
    {
        if (collider.tag == "Player")
            collider.GetComponent<PlayerHealth>().Health.Value -= 10;
    }
}
```

No script owns the trigger logic anymore. The hook raises an event; the
action responds. Both are independently swappable.

---

## How It All Fits Together

```
IntVariable (Health)
    │
    ├── Changed ──► IntEvent (HealthChangedEvent)
    │                    │
    │              IntEventReferenceListener
    │                    │
    │              ┌─────┴──────────────────┐
    │              UnityEvent response    IntAction response
    │              (HealthBar.ChangeFill)  (HealthLogger)
    │
OnTrigger2DHook ──► Collider2DEvent ──► Listener ──► DecreasePlayersHealth (Action)
```

Every arrow is an Inspector assignment. No `GetComponent` chains. No
`FindObjectOfType`. No singleton managers.

---

## Getting Started

Install via the Unity Package Manager using the Git URL:

```
https://github.com/unity-atoms/unity-atoms.git?path=/Packages/Core
```

Create Atoms with the built-in search: **Edit → Create → Atoms Search**
(or hotkey `Alt + 1`), or right-click in the Project window and navigate
**Create → Unity Atoms**.

---

## When to Use Unity Atoms

Unity Atoms is well-suited for:

- Medium-to-large projects where coupling is already a pain point
- Games with shared state read by multiple unrelated systems (health, score, flags)
- Teams where designers need to tweak responses without touching code
- Projects that benefit from runtime-editable values and live debug views

For tiny prototypes the overhead of creating separate assets per value may
outweigh the benefit — use direct references there and migrate if the project
grows.

---

## Further Reading

- [Unity Atoms Documentation](https://unity-atoms.github.io/unity-atoms/)
- [Adam Ramberg's original blog post](https://medium.com/@adamramberg)
- [Ryan Hipple — Game Architecture with Scriptable Objects (GDC 2017)](https://www.youtube.com/watch?v=raQ3iHhE_Kk)
- [GitHub — unity-atoms/unity-atoms](https://github.com/unity-atoms/unity-atoms)
