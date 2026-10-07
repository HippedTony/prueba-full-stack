"use client";

import Link from "next/link";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Todos los campos son obligatiorios");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresa un correo válido");
      return;
    }

    if (message.trim().length < 5) {
      setError("El mensaje debe tener al menos 5 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el formulario");
      }

      setSuccess("Mensaje enviado correctamente.");

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ocurrió un error inesperado",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Link
        href="/admin"
        className="absolute top-5 right-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition duration-300 hover:bg-black hover:text-white"
      >
        Admin
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-8 shadow"
      >
        <div>
          <h1 className="text-3xl font-bold">Contacto</h1>

          <p className="mt-2 text-gray-500">
            Déjamos tus datos y nos pondremos en contacto
          </p>
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block font-medium">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block font-medium">
            Correo
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block font-medium">
            Mensaje
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 w-full rounded-lg border p-3"
            placeholder="Escribe tu mensaje..."
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-red-600">{error}</p>
        )}

        {success && (
          <p className="rounded-lg bg-green-50 p-3 text-green-500">{success}</p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 font-medium text-white cursor-pointer transition-colors duration-300 hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </main>
  );
}
