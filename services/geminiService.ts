// Implements DeepSeek API
const API_KEY = "sk-4eca3ab91c464c0b81f6417bf3f4512b";
const API_URL = "https://api.deepseek.com/chat/completions";

export const generateObservabilityInsight = async (query: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个观测云(Guance Cloud)的专家助手。你的目标是帮助用户理解监控、日志、链路追踪和DQL(Data Query Language)。保持回答简洁、专业且易懂，并推广统一可观测性的好处。如果被问及查询，请提供伪代码或DQL示例。"
          },
          {
            role: "user",
            content: query
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API Response:", errorText);
        throw new Error(`DeepSeek API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "暂时无法生成见解。";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "我目前无法连接到 DeepSeek 知识库，请检查网络或稍后再试。";
  }
};