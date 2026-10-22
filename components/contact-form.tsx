"use client";

import { useRef, useState } from "react";
import { trackEvent } from "./analytics";

type Option = { slug: string; name: string };

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm({
  services,
  defaultService = "",
}: {
  services: Option[];
  defaultService?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const mounted = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setErrors({});

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: data.consent === "on",
          elapsed: Date.now() - mounted.current,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setErrors(body.fieldErrors ?? {});
        setServerMessage(body.message ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      trackEvent("enquiry_submitted", { service: String(data.service ?? "") });
      setState("sent");
    } catch {
      setServerMessage("We couldn't reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="panel">
        <h3>Your enquiry is with us</h3>
        <p>
          A member of the team will reply within one working day. If it's urgent,
          call +254 116 028 888 between 8:00am and 5:00pm.
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn--outline" onClick={() => setState("idle")}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {state === "error" && (
        <p className="notice notice--bad" role="alert">{serverMessage}</p>
      )}

      <div className="form__row">
        <label className={`field ${errors.name ? "field--error" : ""}`}>
          <span>Your name</span>
          <input name="name" autoComplete="name" required />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>
        <label className={`field ${errors.organisation ? "field--error" : ""}`}>
          <span>Organisation</span>
          <input name="organisation" autoComplete="organization" />
        </label>
      </div>

      <div className="form__row">
        <label className={`field ${errors.email ? "field--error" : ""}`}>
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" required />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>
        <label className={`field ${errors.phone ? "field--error" : ""}`}>
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+254" />
          {errors.phone && <span className="field__error">{errors.phone}</span>}
        </label>
      </div>

      <label className="field">
        <span>What do you need help with?</span>
        <select name="service" defaultValue={defaultService}>
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </label>

      <label className={`field ${errors.message ? "field--error" : ""}`}>
        <span>Tell us about it</span>
        <textarea
          name="message"
          required
          placeholder="Portfolio size, sector, what you've already tried — whatever helps us come back with something useful."
        />
        {errors.message && <span className="field__error">{errors.message}</span>}
      </label>

      {/* Honeypot. Left visible to bots, hidden from people and screen readers. */}
      <div className="hp" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={`check ${errors.consent ? "field--error" : ""}`}>
        <input type="checkbox" name="consent" required />
        <span>
          I agree that Collection Africa may use these details to respond to my enquiry,
          as described in the privacy policy.
          {errors.consent && <em className="field__error"> {errors.consent}</em>}
        </span>
      </label>

      <div>
        <button type="submit" className="btn btn--primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
