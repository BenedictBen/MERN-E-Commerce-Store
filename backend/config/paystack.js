

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

class Paystack {
  constructor() {
    this.PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    this.BASE_URL = "https://api.paystack.co";
  }

  makePaystackRequest = async (request) => {
    try {
      const { method, endPoint, body } = request;

      const fetchOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
        },
      };

      if (method === "POST" && body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.BASE_URL}${endPoint}`, fetchOptions);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Paystack request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack API error:', error);
      throw error;
    }
  };

  initializeTransaction = async (body) => {
    return await this.makePaystackRequest({
      endPoint: "/transaction/initialize",
      method: "POST",
      body,
    });
  };

  // ADD THIS NEW METHOD
  verifyTransaction = async (reference) => {
    return await this.makePaystackRequest({
      endPoint: `/transaction/verify/${encodeURIComponent(reference)}`,
      method: "GET",
    });
  };
}

const paystack = new Paystack();

export default paystack;