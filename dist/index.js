"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ("get" in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", {
                  enumerable: true,
                  value: v,
              });
            }
          : function (o, v) {
                o["default"] = v;
            });
  var __importStar =
      (this && this.__importStar) ||
      function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null)
              for (var k in mod)
                  if (k !== "default" && Object.prototype.hasOwnProperty.call(mod))
                      __createBinding(result, mod, k);
          __setModuleDefault(result, mod);
          return result;
      };
  var __awaiter =
      (this && this.__awaiter) ||
      function (thisArg, _arguments, P, generator) {
          function adopt(value) {
              return value instanceof P
                  ? value
                  : new P(function (resolve) {
                        resolve(value);
                    });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) {
                  try {
                      step(generator.next(value));
                  } catch (e) {
                      reject(e);
                  }
                }
                function rejected(value) {
                    try {
                        step(generator["throw"](value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done
                        ? resolve(result.value)
                        : adopt(result.value).then(fulfilled, rejected);
                }
                step(
                    (generator = generator.apply(thisArg, _arguments || [])).next()
                );
            });
        };
    var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
        };
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const helmet_1 = __importDefault(require("helmet"));
    const cors_1 = __importDefault(require("cors"));
    const fs_1 = __importDefault(require("fs"));
    const https_1 = __importDefault(require("https"));
    const http_1 = __importDefault(require("http"));
    const index_1 = __importDefault(require("./logger/index"));
    const routes_1 = __importDefault(require("./routes"));
    const figlet = require("figlet"); // Alterado para usar require em vez de import
    const path_1 = __importDefault(require("path"));
    const socket_io_1 = require("socket.io");
    const allfunctions_1 = __importDefault(require("./functions/allfunctions"));
    const serverEvents_1 = require("./serverEvents");
    require("dotenv/config");
    
    // Usando caminho absoluto para os arquivos de chave
    const privateKey = fs_1.default.readFileSync(path_1.default.join(__dirname, "server.key"));
    const certificate = fs_1.default.readFileSync(path_1.default.join(__dirname, "server.crt"));
    const credentials = {
        key: privateKey,
        cert: certificate,
    };
    
    const app = (0, express_1.default)();
    const httpserver = https_1.default.createServer(credentials, app);
    const httserver = http_1.default.createServer(app);
    const io = new socket_io_1.Server(httpserver);
    
    // Usando o método assíncrono figlet.text
    figlet.text("API DE JOGOS GAMIXI TECHNOLOGY", function (err, data) {
        if (err) {
            console.log("Erro ao gerar arte ASCII:", err);
            return;
        }
        console.log(data, "\n");
    });
    
    const users = new Map();
    io.on("connection", (socket) =>
        __awaiter(void 0, void 0, void 0, function* () {
            console.log("Usuário Conectado");
            socket.on("join", (socket1) =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const token = socket1.token;
                    const gameid = socket1.gameId;
    
                    // Função assíncrona para verificar dados do usuário a cada 10 segundos
                    async function checkUserData() {
                        const user = await allfunctions_1.default.getuserbytoke(token);
                        if (!user[0]) {
                            socket.disconnect(true);
                            return;
                        }
                        const retornado = user[0].valorganho;
                        const valorapostado = user[0].valorapostado;
                        const rtp = Math.round((retornado / valorapostado) * 100);
                        if (isNaN(rtp) === false) {
                            await allfunctions_1.default.updatertp(token, rtp);
                        }
                        setTimeout(checkUserData, 10000);
                    }
    
                    setTimeout(checkUserData, 10000);
                })
            );
    
            (0, serverEvents_1.adicionarListener)( 
                "attganho", 
                (dados) =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        users.forEach(
                            (valor, chave) =>
                                __awaiter(void 0, void 0, void 0, function* () {
                                    let newvalue =
                                        parseFloat(users.get(socket.id).aw) +
                                        dados.aw;
                                    users.set(socket.id, {
                                        aw: newvalue,
                                    });
                                })
                        );
                        (0, serverEvents_1.emitirEventoInterno)("awreceive", {
                            aw: users.get(socket.id).aw,
                        });
                    })
            );
    
            (0, serverEvents_1.adicionarListener)("att", (dados) => {
                users.forEach((valor, chave) => {
                    if (valor.token === dados.token) {
                        return false;
                    } else {
                        users.set(socket.id, {
                            token: dados.token,
                            username: dados.username,
                            bet: dados.bet,
                            saldo: dados.saldo,
                            rtp: dados.rtp,
                            agentid: dados.agentid,
                            socketid: socket.id,
                            gamecode: dados.gamecode,
                            aw: 0,
                        });
                    }
                });
                if (Object.keys(users).length === 0) {
                    users.set(socket.id, {
                        token: dados.token,
                        username: dados.username,
                        bet: dados.bet,
                        saldo: dados.saldo,
                        rtp: dados.rtp,
                        agentid: dados.agentid,
                        socketid: socket.id,
                        gamecode: dados.gamecode,
                        aw: 0,
                    });
                }
            });
    
            socket.on("disconnect", (reason) => {
                users.delete(socket.id);
                console.log("Cliente desconectado:", reason);
            });
        })
    );
    
    app.use((0, cors_1.default)({ credentials: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/", express_1.default.static(path_1.default.join(__dirname, "public")));
    app.use(
        helmet_1.default.contentSecurityPolicy({
            useDefaults: false,
            directives: {
                "Access-Control-Allow-Credentials": "true",
                "default-src": ["'none'"],
                "base-uri": "'self'",
                "font-src": ["'self'", "https:", "data:"],
                "frame-ancestors": ["'self'"],
                "img-src": ["'self'", "data:"],
                "object-src": ["'none'"],
                "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
                "script-src-attr": "'none'",
                "style-src": ["'self'", "https://cdnjs.cloudflare.com"],
            },
        })
    );
    
    // Middleware para adicionar o socket.io em cada requisição
    app.use((req, res, next) => {
        req.io = io; // Adiciona o socket.io ao objeto req
        next();
    });
    
    // Rota raiz
    app.get("/", (req, res) => {
        res.send("Bem-vindo a API de jogos Gamixi Technology!");
    });
    
    // Rota para acessar jogos com ID (Exemplo: /126/)
    app.get("/:gameId", (req, res) => {
        const gameId = req.params.gameId;
        res.send(`Acessando o jogo com ID: ${gameId}`);
    });
    
    app.use("/status", (req, res) => {
        res.json({ status: "operational" });
    });
    
    app.use(routes_1.default);
    
    httpserver.listen(443, () => {
        index_1.default.info("GAMIXI TECHNOLOGY is running on port 443");
    });
    
    httserver.listen(process.env.PORT, () => {
        index_1.default.info(
            `GAMIXI TECHNOLOGY is running on port ${process.env.PORT}`
        );
    });
    
