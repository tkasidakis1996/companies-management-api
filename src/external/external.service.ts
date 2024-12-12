import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalService {
  
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Public API URL

  async get(): Promise<any> {
    
    try {
      const response = await axios.get(this.apiUrl);
      return response.data; // Return the data from the external API
    } catch (error) {
      throw new HttpException(
        'Failed to fetch data from external API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}