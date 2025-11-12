import axios from 'axios';

export class LatexCompilerService {
  private addr: string;

  constructor(addr: string) {
    this.addr = addr;
  }

  async compile(latex: string): Promise<Buffer> {
    const pdf = await axios.post(`${this.addr}/api/v0/compile`, {
      text: latex
    }, {
      responseType: 'arraybuffer'
    });

    return pdf.data;
  }
}
