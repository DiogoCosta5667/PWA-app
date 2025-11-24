import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, TabContent } from "reactstrap";
import Table from "../../../Table";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { useGetData } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
import { TabContext } from "../../contexts/TabProvider/TabContext";

const Games = () => {

  const { register, handleSubmit} = useForm();
  const { isError, isLoading, data, load } = useGetData("games/all-games", 1000, 1);
  const { isLoading: isLoadingPost, postData } = usePostData("games/create-games");
  const { setGamesCount } = useContext(TabContext);

  useEffect(() => {
    if (data.games && Array.isArray(data.games)) {
      setGamesCount(data.games.length);
    }
  }, [data, setGamesCount])

  if (isLoading) {
    return <div>Is Loading</div>
  }

  if (isError) {
    return <div>UPPSSSS</div>
  }

  return (
    <Container>
      <Row>
        <Col className={styles.column}>
          <h3>Create Game</h3>
          {
            isLoadingPost ? <div>is Loading </div> :
              (
                <div className={styles.container}>
                  <form
                    className={styles.form}
                    onSubmit={handleSubmit((addData) => {
                      const formData = new FormData();
                      formData.append("date", addData.date);
                      formData.append("name", addData.name);
                      formData.append("image", addData.image[0]);
                      formData.append("visitor", addData.visitor);
                      formData.append("home", addData.home);

                      postData(formData).then(() => {
                        load();
                      });
                    })}

                  >
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="date">
                        Date:
                      </label>
                      <input
                        data-testid="date"
                        placeholder="date"
                        id="date"
                        type="date"
                        name="date"
                        required
                        {...register("date")}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="name">
                        Name:
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        {...register("name")}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="image">
                        Image:
                      </label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        required
                        {...register("image")}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="visitor">
                        Visitor:
                      </label>
                      <input
                        id="visitor"
                        type="text"
                        {...register("visitor")}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="home">
                        Home:
                      </label>
                      <input
                        id="home"
                        type="text"
                        required
                        {...register("home")}
                      />
                    </div>

                    <Row>
                      <input data-testid="submitButton" className="submit" type="submit" value="Add Game" />
                    </Row>
                  </form>
                </div>
              )
          }

        </Col>

        <Col>
          <Table columns={["date", "name", "image", "team.visitor", "team.home"]} rows={{ data: data.games || [] }} />
        </Col>
      </Row>
    </Container>
  );
};

export default Games;
