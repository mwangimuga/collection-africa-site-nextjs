"use client";

import { useState } from "react";
import { trackEvent } from "./analytics";

type State = "idle" | "sending" | "sent" | "error";

export function ApplicationForm({
  roles,
  defaultRole = "",
}: {
  roles: string[];
  defaultRole?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");

    // Sent as multipart/form-data so the CV travels as a real file.
    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/forms/careers", { method: "POST", body: form });
      const body = await res.json();

      if (!res.ok) {
        setMessage(body.message ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      trackEvent("application_submitted", { role: String(form.get("role") ?? "") });
      setState("sent");
    } catch {
      setMessage("We couldn't reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="panel">
        <h3>Application received</h3>
        <p>
          Thank you. We review every application and contact shortlisted candidates
          directly. Please don't send payment to anyone claiming to process your
          application — we never charge applicants.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} encType="multipart/form-data" noValidate>
      {state === "error" && <p className="notice notice--bad" role="alert">{message}</p>}

      <div className="form__row">
        <label className="field">
          <span>Full name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" required placeholder="+254" />
        </label>
      </div>

      <div className="form__row">
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Role</span>
          <select name="role" defaultValue={defaultRole} required>
            <option value="">Choose a role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
            <option value="Speculative application">Speculative application</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Where are you based?</span>
        <input name="location" placeholder="Town or county" />
      </label>

      <label className="field">
        <span>CV</span>
        <input name="cv" type="file" accept=".pdf,.doc,.docx" required />
        <span className="field__hint">PDF or Word, up to 5 MB.</span>
      </label>

      <label className="field">
        <span>Anything you'd like us to know</span>
        <textarea name="message" rows={4} />
      </label>

      <div className="hp" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="check">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that Collection Africa may store and process my application data
          for recruitment purposes, as described in the privacy policy.
        </span>
      </label>

      <div>
        <button type="submit" className="btn btn--primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send application"}
        </button>
      </div>
    </form>
  );
}
