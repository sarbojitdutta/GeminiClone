"use client"
import { useState } from "react"
import MessageInput from "@/components/ui/MessageInput"
import MessageWindow from "@/components/ui/MessageWindow"
import { ChatHistory, ChatSettings, Message, MessageRole } from "@/types"

export default function Home() {
    const [history, setHistory] = useState<ChatHistory>([])
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [settings, setSettings] = useState({
        temperature: 1,
        model: "gemini-2.5-flash",
        systemInstructions: "You are a helpful assistant."
    })

    const handleSendMessage = async (message: string) => {
        const newUserMessage: Message = {
            role: "user" as MessageRole,
            parts: [{ text: message }]
        }
        const updatedHistory = [...history, newUserMessage]
        setHistory(updatedHistory)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userMessage: message,
                    history: updatedHistory,
                    settings: settings
                })
            })
            const data = await response.json()

            if (data.error) {
                console.error("Error from API:", data.error)
                return
            }
            const aiMessage: Message = {
                role: "model" as MessageRole,
                parts: [{ text: data.response }]
            }
            setHistory(prev => [...prev, aiMessage])
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    const handleOpenSettings = () => {
        setIsSettingsOpen(true)
    }
    const handleCloseSettings = () => {
        setIsSettingsOpen(false)
    }

    const handleSaveSettings = (newSettings: ChatSettings) => {
        setSettings(newSettings);
    }

    return (
        <div className="flex flex-col py-32">
            <MessageWindow history={history} />

            {/* <SettingsModal
                isOpen={isSettingsOpen}
                onClose={handleCloseSettings}
                onSave={handleSaveSettings}
                currentSettings={settings}
            /> */}
            <MessageInput onSend={handleSendMessage} onOpenSettings={handleOpenSettings} />
        </div>
    )
}
