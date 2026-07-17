const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        status: "NovaChat API Online"
    });
});

app.post("/chat", async (req, res) => {

    const message = req.body.message;

    if (!message) {
        return res.status(400).json({
            error: "No message provided."
        });
    }

    try {

        const response = await fetch(
            "https://api.perplexity.ai/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization":
                        `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "sonar",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are NovaChat, a helpful AI assistant."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply =
            data.choices?.[0]?.message?.content ||
            "No response.";

        res.json({
            reply
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Server Error"
        });

    }

});

app.listen(PORT, () => {

    console.log(
        `NovaChat Server running on port ${PORT}`
    );

});
