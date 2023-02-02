// https://leetcode.com/problems/best-team-with-no-conflicts/

// slow solution
// Runtime 5417 ms. Beats 11.11%.
// Memory 61.5 MB. Beats 11.11%.
const bestTeamScore = (scores, ages) => {
  const scoresByAge = {}
  let maxAge = 0
  let minAge = 1000
  
  for (let i = 0; i < scores.length; i++) {
    const age = ages[i], score = scores[i]
    scoresByAge[age] = scoresByAge[age] || []
    scoresByAge[age].push(score)
    if (minAge > age) minAge = age
    if (maxAge < age) maxAge = age
  }

  let teams = []

  for (let age = minAge; age <= maxAge; age++) {
    const ageScores = scoresByAge[age]

    if (!ageScores) continue

    ageScores.sort((a, b) => a - b)
    
    for (let i = 0; i < ageScores.length; i++) {
        const newTeams = []
        const score = ageScores[i]
        let createOneManTeam = true

        for (let j = 0; j < teams.length; j++) {
            const team = teams[j]

            if (team.highestScore > score) continue

            if (team.highestScore === score) {
                createOneManTeam = false
                team.totalScore += score
                team.highestAge = age
            } else {
                createOneManTeam = false
                newTeams.push({
                    totalScore: team.totalScore + score,
                    highestScore: score,
                    highestAge: age
                })
            }
        }
        
        if (createOneManTeam) {
            newTeams.push({
                totalScore: score,
                highestScore: score,
                highestAge: age
            })
        }

        const allTeams = teams.concat(newTeams)

        const bestTeams = allTeams.reduce((acc, team) => {
            const teamKey = team.highestAge + ' ' + team.highestScore
            const existedTeam = acc[teamKey]
            if (!existedTeam) acc[teamKey] = team
            else if (existedTeam.totalScore < team.totalScore) acc[teamKey] = team
            return acc
        }, {})

        teams = Object.values(bestTeams)
    }
  }

  return teams.reduce((acc, team) => team.totalScore > acc ? team.totalScore : acc, 0)
};

// const scores = [1,3,5,10,15], ages = [1,2,3,4,5]
// const scores = [4,5,6,5], ages = [2,1,2,1]
const scores = [1,2,3,5], ages = [8,9,10,1]


console.log(bestTeamScore(scores, ages))