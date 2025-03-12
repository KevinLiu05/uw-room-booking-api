const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const faiss = require('faiss-node');
const { OpenAI } = require('openai');

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Blob 文件 URL - 替换为你的实际 URL
const DATA_URL = 'https://jjfsul456vsafug4.public.blob.vercel-storage.com/room_bookings_processed-IF2OmgpXmWLOONv3jC_.csv';
const INDEX_URL = 'https://jjfsul456vsafug4.public.blob.vercel-storage.com/room_bookings_index-PDochr1f6eJns6xvSbvFmgkYT_.faiss';
const CONTEXT_URL = 'https://jjfsul456vsafug4.public.blob.vercel-storage.com/context_texts-91xVjbMz9LWjnlJhC1gQKJ5P4rlnC7.json';


// 缓存加载的资源
let dataCache = {
  df: null,
  index: null,
  contextTexts: null,
};

// 从 URL 加载 CSV
async function loadCSV() {
  if (dataCache.df) return dataCache.df;
  
  try {
    const response = await axios.get(DATA_URL);
    const results = [];
    
    return new Promise((resolve, reject) => {
      Readable.from(response.data)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          dataCache.df = results;
          resolve(results);
        })
        .on('error', (error) => reject(error));
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
}

// 从 URL 加载 FAISS 索引
async function loadIndex() {
  if (dataCache.index) return dataCache.index;
  
  try {
    const response = await axios.get(INDEX_URL, { responseType: 'arraybuffer' });
    const indexBuffer = Buffer.from(response.data);
    const index = await faiss.readIndex(indexBuffer);
    dataCache.index = index;
    return index;
  } catch (error) {
    console.error('Error loading FAISS index:', error);
    throw error;
  }
}

// 从 URL 加载上下文文本
// 从 URL 加载上下文文本
async function loadContextTexts() {
  if (dataCache.contextTexts) return dataCache.contextTexts;
  
  try {
    // Now loading JSON data instead of pickle
    const response = await axios.get(CONTEXT_URL);
    dataCache.contextTexts = response.data;
    return response.data;
  } catch (error) {
    console.error('Error loading context texts:', error);
    throw error;
  }
}
// 生成嵌入向量
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: [text],
  });
  return response.data[0].embedding;
}

// 搜索 FAISS
async function searchFaiss(query, k = 5) {
  try {
    const index = await loadIndex();
    const contextTexts = await loadContextTexts();
    const queryEmbedding = await generateEmbedding(query);
    
    // 转换为 float32 数组
    const queryEmbeddingArray = new Float32Array(queryEmbedding);
    
    // 搜索索引
    const results = await index.search(queryEmbeddingArray, k);
    const { distances, indices } = results;
    
    // 获取对应的上下文文本
    return indices.map(idx => contextTexts[idx]);
  } catch (error) {
    console.error('Error searching FAISS:', error);
    throw error;
  }
}

// 生成回答
async function generateAnswer(query, contexts) {
  const systemPrompt = `
    You are an assistant specialized in answering questions about University of Washington Seattle campus room bookings.
    Use the provided context information to answer the question.
    If you cannot find the answer in the context, clearly state that.
    Do not make up information. Be concise and helpful.
  `;
  
  const userPrompt = `Question: ${query}\n\nContext Information:\n` +
    contexts.map((context, i) => `${i+1}. ${context}`).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 500
  });
  
  return response.choices[0].message.content;
}

// 按条件过滤
function filterByCriteria(data, criteria) {
  return data.filter(item => {
    for (const [key, value] of Object.entries(criteria)) {
      if (!item[key]) return false;
      
      if (typeof value === 'string') {
        if (!item[key].toLowerCase().includes(value.toLowerCase())) return false;
      } else {
        if (item[key] != value) return false;
      }
    }
    return true;
  });
}

module.exports = {
  loadCSV,
  loadIndex,
  loadContextTexts,
  generateEmbedding,
  searchFaiss,
  generateAnswer,
  filterByCriteria
};