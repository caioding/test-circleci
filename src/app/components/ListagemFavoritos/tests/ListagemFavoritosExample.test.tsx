import { mockProdutos } from "@/app/mocks/produtos";
import { screen, render } from "@testing-library/react";
import {
  FavoritosProvider,
  useProdutosFavoritos,
  useValorTotalFavoritos,
} from "@/app/State/FavoritosProvider";
import { calculaValorComPorcentagemDeDesconto } from "@/app/helpers";
import ListagemFavoritos from "../ListagemFavoritos";

jest.mock("../../../State/FavoritosProvider", () => ({
  ...jest.requireActual("../../../State/FavoritosProvider"),
  useProdutosFavoritos: jest.fn(),
  useValorTotalFavoritos: jest.fn(),
}));

describe("Listagem favoritos", () => {
  it("deve renderizar corretamente as informações do produto favoritado", () => {
    const produtoMockado = mockProdutos[0];
    const useProdutosFavoritosMock = useProdutosFavoritos as jest.Mock;
    useProdutosFavoritosMock.mockReturnValue([produtoMockado]);

    render(
      <FavoritosProvider>
        <ListagemFavoritos />
      </FavoritosProvider>
    );

    const preco = calculaValorComPorcentagemDeDesconto(
      Number(produtoMockado.preco),
      produtoMockado.desconto
    );

    expect(screen.getByText(produtoMockado.nome)).toBeInTheDocument();
    expect(screen.getByText(`R$ ${preco.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`${produtoMockado.desconto}%`)).toBeInTheDocument();
    expect(screen.getByText(produtoMockado.descricao)).toBeInTheDocument();
    expect(
      screen.getByAltText(produtoMockado.fotos[0].titulo)
    ).toBeInTheDocument();
  });

  it("deve mostrar uma mensagem caso o carrinho esteja vazio", () => {
    const useProdutosFavoritosMock = useProdutosFavoritos as jest.Mock;
    useProdutosFavoritosMock.mockReturnValue([]);

    render(
      <FavoritosProvider>
        <ListagemFavoritos />
      </FavoritosProvider>
    );

    expect(
      screen.getByText("Sua lista de favoritos está vazia.")
    ).toBeInTheDocument();
  });

  it("deve mostrar a quantidade de produtos no carrinho corretamente", () => {
    const useProdutosFavoritosMock = useProdutosFavoritos as jest.Mock;
    useProdutosFavoritosMock.mockReturnValue([
      mockProdutos[0],
      mockProdutos[1],
    ]);

    render(
      <FavoritosProvider>
        <ListagemFavoritos />
      </FavoritosProvider>
    );

    expect(screen.getByText("Quantidade de produtos: 2")).toBeInTheDocument();
  });

  it("deve mostrar o valor total da compra", () => {
    const useProdutosFavoritosMock = useProdutosFavoritos as jest.Mock;
    useProdutosFavoritosMock.mockReturnValue([
      mockProdutos[0],
      mockProdutos[1],
    ]);

    const useValorTotalFavoritosMock = useValorTotalFavoritos as jest.Mock;
    useValorTotalFavoritosMock.mockReturnValue("4,162,08");

    render(
      <FavoritosProvider>
        <ListagemFavoritos />
      </FavoritosProvider>
    );

    expect(screen.getByText("Valor total: R$ 4,162,08")).toBeInTheDocument();
  });
});
