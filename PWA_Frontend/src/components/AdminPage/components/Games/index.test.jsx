import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as useGetData from "../../hooks/useGetData";
import * as usePostData from "../../hooks/usePostData";
import { TabContext } from "../../contexts";
import Games from ".";

describe("Games", () => {
  let setGamesCountMock;
  let addDataMock;

  beforeEach(() => {
    // vamos mockar o nosso hook para ter controlo total. Consoante os testes podemos mudar a resposta
    vi.spyOn(useGetData, "useGetData").mockReturnValue({
      data: {
        games: [],
      },
      isLoading: false,
    });

    // criar um mock desta funcao vai nos permitir perceber se ela foi chamada e o seu resultado.
    addDataMock = vi.fn(() => ({}));
    setGamesCountMock = vi.fn();

    // vamos mockar o nosso hook para ter controlo total. Consoante os testes podemos mudar a resposta
    vi.spyOn(usePostData, "usePostData").mockReturnValue({
      postData: addDataMock,
      isLoading: false,
    });
  });

  // Colocar o provider à volta do nosso componente para alimentar a app.
  const renderComponent = (
    component,
    value = { setGamesCount: setGamesCountMock }
  ) => {
    return (
      <TabContext.Provider value={value}>{component}</TabContext.Provider>
    );
  };

  it("renders the component", () => {
    const { container } = render(renderComponent(<Games />));

    expect(container).toMatchSnapshot();
  });

  describe("when the data has games", () => {
    beforeEach(() => {
      // se apesar de no beforeEach maior termos determinados valores,
      // para este teste temos que alterar novamente porque o caso é diferente.
      // neste caso a nossa resposta vai ter objectos (jogos)
      vi.spyOn(useGetData, "useGetData").mockReturnValue({
        data: {
          games: [
            {
              _id: 1,
              date: "22/10/2022",
              name: "Name",
              image: "url",
              team: {
                visitor: "visitor",
                home: "home",
              },
            },
          ],
        },
        isLoading: false,
      });
    });

    it("show must call the setGames", () => {
      render(renderComponent(<Games />));

      expect(setGamesCountMock).toHaveBeenCalledWith(1);
    });
  });

  describe("when is loading games", () => {
    beforeEach(() => {
      // Mais uma vez alteramos a resposta, mas desta vez queremos fingir que estamos a carregar
      vi.spyOn(useGetData, "useGetData").mockReturnValue({
        data: {
          games: [],
        },
        isLoading: true,
      });
    });

    it("renders the component with loading", () => {
      render(renderComponent(<Games />));

      expect(screen.getByText("Is Loading")).toBeInTheDocument();
    });
  });

  describe("when is happens an error", () => {
    beforeEach(() => {
      // Mais uma vez alteramos a resposta, mas desta vez queremos fingir que temos algum tipo de erro
      vi.spyOn(useGetData, "useGetData").mockReturnValue({
        data: {
          games: [],
        },
        isError: true,
      });
    });

    it("renders the component with error", () => {
      render(renderComponent(<Games />));

      expect(screen.getByText("UPPSSSS")).toBeInTheDocument();
    });
  });

  describe("when is posting", () => {
    beforeEach(() => {
      // Mais uma vez alteramos a resposta de um hook diferente
      vi.spyOn(usePostData, "usePostData").mockReturnValue({
        addData: () => {},
        isLoading: true,
      });
    });

    it("renders the component with loading", () => {
      render(renderComponent(<Games />));

      expect(screen.getByText("is Loading")).toBeInTheDocument();
    });
  });

  describe("when is fill the all inputs", () => {
    it("renders the component with inputs filled", async () => {
      render(renderComponent(<Games />));

      // Vamos procurar o input pelo seu role e nome.
      userEvent.type(
        screen.getByRole("textbox", { name: /name/i }),
        "some Name"
      );

      // Vamos procurar o input pelo data-test-id
      userEvent.clear(screen.getByTestId("date"));
      userEvent.type(screen.getByTestId("date"), "2020-01-02");
      expect(screen.getByTestId("date")).toHaveValue("2020-01-02");

      // Vamos procurar o input pelo label
      userEvent.type(screen.getByLabelText(/visitor/i), "Porto");
      expect(screen.getByLabelText(/visitor/i)).toHaveValue("Porto");

      userEvent.type(screen.getByLabelText(/home/i), "home");
      expect(screen.getByLabelText(/home/i)).toHaveValue("home");
    });

    it("the call add data with correct values", async () => {
      render(renderComponent(<Games />));

      // Neste caso vamos preencher o formulário com as condições mínimas
      userEvent.type(
        screen.getByRole("textbox", { name: /name/i }),
        "some Name"
      );

      userEvent.clear(screen.getByTestId("date"));
      userEvent.type(screen.getByTestId("date"), "2020-01-02");

      userEvent.type(screen.getByLabelText(/home/i), "home");

      expect(screen.getByTestId("submitButton")).toBeInTheDocument();
      userEvent.click(screen.getByTestId("submitButton"));

      /* Depois de clicarmos no submit do form (figados) queremos saber se o form
       enviou os dados corretos para o submit. Sendo que este submit é um mock,
       temos acesso a tudo e podemos verificar se o form foi enviado com os dados corretos.
       Se alguma coisa mudar num submit e uma validação deixar passar, este mock
       acusa a questão, e conseguimos perceber onde e como se deu origem a uma
       chave de form sem valor.*/
      await waitFor(() => {
        expect(addDataMock).toHaveBeenCalledWith(
          expect.objectContaining({
            date: "2020-01-02",
            name: "some Name",
            image: "url",
            team: {
              visitor: "",
              home: "",
            },
          })
        );
        expect.anything();
      });
    });
  });
});
